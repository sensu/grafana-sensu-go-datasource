import _ from 'lodash';

import sensu from './sensu/sensu';
import {
  API_ENDPOINTS,
  DEFAULT_LIMIT,
  DEFAULT_AGGREGATION_LIMIT,
  TIME_PROPERTIES,
} from './constants';
import FieldSelector from './FieldSelector';
import FilterUtils from './utils/datasource_filter_util';
import QueryUtils from './utils/query_util';
import transformer from './transformer';
import ConfigMigration from './utils/config_migration_util';
import AggregationUtils from './utils/data_aggregation_util';

import {
  PreparedTarget,
  ColumnMapping,
  DataPoint,
  ClientSideFilter,
  QueryComponents,
  InstanceSettings,
  QueryOptions,
  GrafanaTarget,
} from './types';

export default class SensuDatasource {
  url: string;

  /** @ngInject */
  constructor(
    public instanceSettings: InstanceSettings,
    public backendSrv,
    private templateSrv
  ) {
    this.url = instanceSettings.url.trim();
  }

  /**
   * Preprocces the query targets like resolving template variables.
   */
  prepareQuery = (target: GrafanaTarget, queryOptions) => {
    // resolve API url
    const apiUrl = this._getApiUrl(target);
    // resolve filters
    const clientFilters = _.cloneDeep(target.clientSideFilters);
    const serverFilters = _.cloneDeep(target.serverSideFilters);

    const preparedTarget: PreparedTarget = <PreparedTarget>{
      apiUrl,
      clientFilters,
      serverFilters,
      target: _.cloneDeep(target), //ensure modifications are not globally propagated
    };

    this._resolveTemplateVariables(preparedTarget, queryOptions);

    return preparedTarget;
  };

  /**
   * Resolves template variables in the given prepared target.
   */
  _resolveTemplateVariables = (preparedTarget: PreparedTarget, queryOptions) => {
    const {target, clientFilters, serverFilters} = preparedTarget;

    // resolve variables in namespaces
    const namespaces: string[] = this.templateSrv
      .replace(target.namespace, queryOptions.scopedVars, 'pipe')
      .split('|');

    target.namespaces = namespaces;

    // resolve variables in filters
    [clientFilters, serverFilters].forEach(filters =>
      filters.forEach(filter => {
        filter.key = this.templateSrv.replace(filter.key, queryOptions.scopedVars, 'csv');
        filter.value = this.templateSrv.replace(
          filter.value,
          queryOptions.scopedVars,
          'regex'
        );
      })
    );
  };

  /**
   * Returns the url of the API used by the given target.
   */
  _getApiUrl = (target: GrafanaTarget) => {
    const apiEndpoint: any = _.find(API_ENDPOINTS, {value: target.apiEndpoints});
    if (apiEndpoint) {
      return apiEndpoint.url;
    } else {
      return API_ENDPOINTS[0].url;
    }
  };

  /**
   * Executes a query.
   */
  query(queryOptions) {
    const queryTargets = _(queryOptions.targets)
      .map(ConfigMigration.migrate)
      .map(target => this.prepareQuery(target, queryOptions))
      .value();

    // empty result in case there is no query defined
    if (queryTargets.length === 0) {
      return Promise.resolve({data: []});
    }

    const queries = queryTargets.map(prepTarget => {
      const {
        apiUrl,
        clientFilters,
        serverFilters,
        target: {queryType, fieldSelectors, namespaces, limit},
      } = prepTarget;

      // verify and set correct limit
      let parsedLimit: number = _.defaultTo(parseInt(limit || ''), -1);
      if (parsedLimit < 0) {
        if (queryType === 'aggregation') {
          parsedLimit = DEFAULT_AGGREGATION_LIMIT;
        } else {
          parsedLimit = DEFAULT_LIMIT;
        }
      }

      const queryOptions: QueryOptions = {
        method: 'GET',
        url: apiUrl,
        namespaces,
        limit: parsedLimit,
        responseFilters: serverFilters,
      };

      return sensu
        .query(this, queryOptions)
        .then(this._timeCorrection)
        .then(data => this._filterData(data, clientFilters))
        .then(data => {
          if (queryType === 'field') {
            return this._queryFieldSelection(data, fieldSelectors);
          } else if (queryType === 'aggregation') {
            return this._queryGroupAndAggregate(data, prepTarget);
          } else {
            return [];
          }
        });
    });

    return Promise.all(queries).then((queryResults: any) => {
      if (queryOptions.resultAsPlainArray) {
        // return only values - e.g. for template variables
        const result = _(queryResults)
          .map(result => transformer.toTable(result))
          .map(result => result.rows)
          .flatten()
          .flatten()
          .filter()
          .map(value => {
            return {text: value};
          })
          .value();

        return result;
      } else {
        const resultDataList: any[] = _.flatMap(queryResults, (queryResult, index) => {
          const {target: {format}} = queryTargets[index];

          if (format === 'series') {
            // return time series format
            return transformer.toTimeSeries(queryResult);
          } else {
            // return table format
            return transformer.toTable(queryResult);
          }
        });

        return {
          data: resultDataList,
        };
      }
    });
  }

  /**
   * Converting the timestamps from seconds to miliseconds because Sensu's timestamp
   * resolution is in seconds but Grafana uses miliseconds.
   */
  _timeCorrection = (data: any) => {
    _.each(data, dataElement => {
      // iterate over all time properties
      _.each(TIME_PROPERTIES, property => {
        // fetch the properties value
        const time = _.get(dataElement, property, -1);
        // in case a time is set, we multiply them by 1000 to get miliseconds.
        // in case the time is 0, we'll remove it, otherwise Grafana will display the epoch's starting times
        if (time > 0) {
          _.set(dataElement, property, time * 1000);
        } else {
          _.unset(dataElement, property);
        }
      });
    });
    return data;
  };

  /**
   * This function will group the given data (if specified in the PreparedTarget) and aggregate it accordingly.
   *
   * @param data the data to group and aggregate
   * @param prepTarget the settings for the grouping and aggregation
   */
  _queryGroupAndAggregate = (data: any[], prepTarget: PreparedTarget) => {
    const {
      target: {
        aggregationAlias: alias,
        aggregationType: type,
        format,
        groupBy: groupAttribute,
      },
    } = prepTarget;
    // the name of the result value (the metric name if timeseries format is used, otherwise the column header)
    const name = alias ? alias : type || 'value';

    if (!groupAttribute) {
      // just aggregate without grouping
      const aggregationResult = this._queryAggregation(data, name, prepTarget);
      return [aggregationResult];
    } else {
      // first group the data..
      const groups = _.groupBy(data, groupAttribute);

      // ..then aggregate the individual groups
      const groupResult = _(groups)
        .map((dataGroup, groupKey) =>
          this._queryAggregation(dataGroup, groupKey, prepTarget)
        )
        .value();

      if (format === 'table' && groupResult) {
        // we transform the groups into multiple columns in case the table format is used
        return this._mergeTableAggregation(groupResult, groupAttribute, name);
      } else {
        return groupResult;
      }
    }
  };

  /**
   * We merge the seperate aggregation result into a single one, thus we get a nicer visualization
   * in the table panel, where the group-attribute and value have their own column.
   */
  _mergeTableAggregation = (
    groupData: (DataPoint[] | null)[],
    groupByAttribute: string,
    alias: string
  ) => {
    return _(groupData)
      .map(group => {
        if (!group || group.length == 0) {
          return null;
        }
        const point: DataPoint = group[0];
        return [
          {
            name: groupByAttribute,
            value: point.name,
          },
          {
            name: alias,
            value: point.value,
          },
        ];
      })
      .filter() // null values
      .value();
  };

  /**
   * Process the data if the query type is 'aggregation'.
   */
  _queryAggregation = (data: any[], name: string, prepTarget: PreparedTarget) => {
    const {aggregationType: type} = prepTarget.target;

    if (type === 'count') {
      return AggregationUtils.count(data, name);
    } else if (type === 'sum') {
      const {aggregationField} = prepTarget.target;
      return AggregationUtils.sum(data, name, aggregationField);
    } else {
      throw new Error('The aggreation type "' + type + '" is not supported.');
    }
  };

  /**
   * Process the data if the query type is 'field'.
   */
  _queryFieldSelection = (data: any, fieldSelectors: FieldSelector[]) => {
    const columnMappings: ColumnMapping[] = this._extractColumnMappings(
      data,
      fieldSelectors
    );

    const resultData = _.map(data, dataElement => {
      // extract selected data
      return _.map(columnMappings, mapping => {
        const value: any = _.get(dataElement, mapping.path);

        return <DataPoint>{
          name: mapping.alias,
          value: value,
        };
      });
    });

    return resultData;
  };

  /**
   * Creates a column mapping - which object attribute/path is related to which column.
   */
  _extractColumnMappings = (data: any, fieldSelectors: FieldSelector[]) => {
    const result: ColumnMapping[] = _.flatMap(fieldSelectors, selector => {
      const paths = _(data)
        .map(dataElement => this.resolvePaths(selector, dataElement))
        .flatMap()
        .uniq()
        .value();

      if (selector.alias) {
        if (paths.length > 1) {
          // use the alias in combination with an index as column name
          return _.map(paths, (path, index) => {
            return <ColumnMapping>{
              path: path,
              alias: selector.alias + '.' + index,
            };
          });
        } else {
          // use the alias instead the path as column name
          return _.map(paths, path => {
            return <ColumnMapping>{
              path: path,
              alias: selector.alias,
            };
          });
        }
      } else {
        // use the path itself as column name
        return _.map(paths, path => {
          return <ColumnMapping>{
            path: path,
            alias: path,
          };
        });
      }
    });

    return result;
  };

  /**
   * Returns a filtered representation of the given data.
   */
  _filterData = (data: any, filters: ClientSideFilter[]) => {
    return _.filter(data, dataElement =>
      _.every(filters, filter => this._matches(dataElement, filter))
    );
  };

  /**
   * Returns whether the given element matches the given filter.
   */
  _matches = (element: any, filter: ClientSideFilter) => {
    const filterKey: string = filter.key;
    const matcher: string = filter.matcher;
    const filterValue: string = filter.value;

    const elementValue: any = _.get(element, filterKey);

    return FilterUtils.matchs(filterValue, matcher, elementValue);
  };

  /**
   * Resolves all existing paths of the specified selector based on the given data.
   * Example: if the selector is '*' all possible attibutes (including nested) will be returned.
   */
  resolvePaths = (selector: any, data: any) => {
    let selection: any = data;
    let lastSelector = '';
    let basePath = '';

    for (let i = 0; i < selector.fieldSegments.length; i++) {
      const segment: any = selector.fieldSegments[i];
      lastSelector = segment.value;

      if (lastSelector !== '*') {
        if (basePath === '') {
          basePath = lastSelector;
        } else {
          basePath = basePath + '.' + lastSelector;
        }
        selection = _.get(selection, lastSelector);
      }
    }

    if (lastSelector === '*') {
      const paths = this._deepResolve(selection);
      if (basePath === '') {
        return paths;
      } else {
        return _.map(paths, path => basePath + '.' + path);
      }
    } else {
      return [basePath];
    }
  };

  _deepResolve = data => {
    const keys: string[] = Object.keys(data);

    return _.flatMap(keys, key => {
      if (_.isPlainObject(data[key])) {
        return _.map(this._deepResolve(data[key]), nestedKeys => {
          return key + '.' + nestedKeys;
        });
      } else {
        return key;
      }
    });
  };

  /**
   * Executes a query based on the given query command which is a string representation of it.
   */
  metricFindQuery(query: string) {
    return this._query(query);
  }

  /**
   * Executes the given query command.
   */
  _query = (query: string) => {
    const queryComponents = QueryUtils.extractQueryComponents(query);

    if (queryComponents === null) {
      return Promise.resolve([]);
    }
    const options: any = this._transformQueryComponentsToQueryOptions(queryComponents);
    options.resultAsPlainArray = true;

    return this.query(options);
  };

  /**
   * Transforms the given query components into an options object which can be used by the `query(..)` function.
   */
  _transformQueryComponentsToQueryOptions = (queryComponents: QueryComponents) => {
    const {
      apiKey,
      selectedField,
      clientFilters,
      serverFilters,
      namespace,
      limit,
    } = queryComponents;

    const options = {
      targets: [
        <GrafanaTarget>{
          apiEndpoints: apiKey,
          queryType: 'field',
          namespace: namespace,
          limit: _.isNaN(limit) ? null : new String(limit),
          fieldSelectors: [
            <FieldSelector>{
              fieldSegments: [
                {
                  value: selectedField,
                },
              ],
            },
          ],
          format: 'table',
          clientSideFilters: clientFilters,
          serverSideFilters: serverFilters,
          version: 2,
        },
      ],
    };

    return options;
  };

  /**
   * Used by the config UI to test a datasource.
   */
  testDatasource() {
    const useApiKey = _.get(this.instanceSettings, 'jsonData.useApiKey', false);

    // the /auth/test endpoint is only available for testing basic auth credentials
    const testUrl = useApiKey ? '/api/core/v2/namespaces' : '/auth/test';

    return sensu
      ._request(this, 'GET', testUrl)
      .then(() => {
        return {
          status: 'success',
          message: 'Successfully connected against the Sensu Go API',
        };
      })
      .catch(error => {
        if (useApiKey && error.data === 'access_error') {
          return {
            status: 'error',
            message: 'API Key Invalid: Could not logged in using API key',
          };
        }
        return {status: 'error', message: error.message};
      });
  }
}
