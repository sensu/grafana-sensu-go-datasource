import _ from 'lodash';

import sensu from './sensu/sensu';
import SensuQueryOptions from './sensu/query_options';
import {API_ENDPOINTS} from './constants';
import FieldSelector from './FieldSelector';
import FilterUtils from './utils/datasource_filter_util';
import QueryUtils from './utils/query_util';

import PreparedTarget from './model/PreparedTarget';
import ColumnMapping from './model/ColumnMapping';
import DataPoint from './model/DataPoint';
import Filter from './model/Filter';
import QueryComponents from './model/QueryComponents';

export default class SensuDatasource {
  url: string;

  /** @ngInject */
  constructor(public instanceSettings, public backendSrv, private templateSrv) {
    this.url = instanceSettings.url.trim();
  }

  /**
   * Preprocces the query targets like resolving template variables.
   */
  prepareQuery = (target, options) => {
    // resolve API url
    const apiUrl = this._getApiUrl(target);
    // resolve filters
    const filters = this._getFilters(target, options);

    const preparedTarget: PreparedTarget = <PreparedTarget>{
      apiUrl: apiUrl,
      filters: filters,
      target: _.cloneDeep(target), //ensure modifications are not globally propagated
    };

    this._resolveTemplateVariables(preparedTarget, options);

    return preparedTarget;
  };

  /**
   * Resolves template variables in the given prepared target.
   */
  _resolveTemplateVariables = (pTarget: PreparedTarget, options) => {
    pTarget.target.namespace = this.templateSrv.replace(pTarget.target.namespace);
  };

  /**
   * Returns the url of the API used by the given target.
   */
  _getApiUrl = target => {
    const apiEndpoint: any = _.find(API_ENDPOINTS, {value: target.apiEndpoints});
    if (apiEndpoint) {
      return apiEndpoint.url;
    } else {
      return API_ENDPOINTS[0].url;
    }
  };

  /**
   * Returns an array of processed filters and resolved variables.
   */
  _getFilters = (target, options) => {
    return _(target.filterSegments)
      .filter(segmentArray => segmentArray.length === 3)
      .filter(segmentArray => !segmentArray[2].fake)
      .map(segmentArray => {
        return <Filter>{
          key: this.templateSrv.replace(segmentArray[0].value, options.scopedVars, 'csv'),
          matcher: segmentArray[1].value,
          value: this.templateSrv.replace(
            segmentArray[2].value,
            options.scopedVars,
            'regex'
          ),
        };
      })
      .value();
  };

  /**
   * Processes a given string and resolves template variable if any exists in it.
   */
  _resolveRegex = (value: string, options: any) => {
    return this.templateSrv.replace(value, options.scopedVars, 'regex');
  };

  /**
   * Executes a query.
   */
  query(options, onlyValues?: boolean) {
    const queryTargets = _.map(options.targets, target =>
      this.prepareQuery(target, options)
    );

    if (queryTargets.length === 0) {
      return Promise.resolve({data: []});
    }

    const queries = queryTargets.map(prepTarget => {
      const {
        apiUrl,
        filters,
        target: {queryType, fieldSelectors, namespace, limit},
      } = prepTarget;

      const queryOptions: SensuQueryOptions = {
        method: 'GET',
        url: apiUrl,
        namespace: namespace,
        limit: limit,
      };

      return sensu
        .query(this, queryOptions)
        .then(requestResult => requestResult.data)
        .then(data => this._filterData(data, filters))
        .then(data => {
          if (queryType === 'field') {
            return this._queryFieldSelection(data, fieldSelectors);
          } else if (queryType === 'aggregation') {
            return this._queryAggregation(data, prepTarget);
          } else {
            return [];
          }
        });
    });

    return Promise.all(queries).then((queryResults: any) => {
      // return only values - e.g. for variables
      if (onlyValues) {
        return _(queryResults)
          .map(result => this._transformToTable(result))
          .map(result => result.rows)
          .flatten()
          .flatten()
          .map(value => {
            return {text: value};
          })
          .value();
      } else {
        const resultDataList: any[] = _.flatMap(queryResults, (queryResult, index) => {
          const {target: {format}} = queryTargets[index];

          if (format === 'series') {
            // return time series format
            return this._transformToSeries(queryResult);
          } else {
            // return table format
            return this._transformToTable(queryResult);
          }
        });

        return {
          data: resultDataList,
        };
      }
    });
  }

  /**
   * Process the data if the query type is 'aggregation'.
   */
  _queryAggregation = (data: any[], prepTarget: PreparedTarget) => {
    const {
      target: {aggregationAlias: alias, aggregationType: type, aggregationField: field},
    } = prepTarget;
    const name = alias ? alias : type;

    if (type === 'count') {
      return <DataPoint[][]>[
        [
          {
            name: name,
            value: data.length,
          },
        ],
      ];
    } else if (type === 'sum') {
      if (!field) {
        return [];
      } else {
        const result: number = _.sumBy(data, field);

        if (_.isFinite(result)) {
          return <DataPoint[][]>[
            [
              {
                name: name,
                value: result,
              },
            ],
          ];
        } else {
          return [];
        }
      }
    } else {
      return [];
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
   * Transforms the given data into a time series representation.
   */
  _transformToSeries = (dataMatrix: DataPoint[]) => {
    const now: number = Date.now();

    // maps the data to a series - skips all values which are not finite
    // - name => series name
    // - value => value
    return _(dataMatrix)
      .flatten()
      .filter(data => _.isFinite(data.value))
      .map(data => {
        return {
          target: data.name,
          datapoints: [[data.value, now]],
        };
      })
      .value();
  };

  /**
   * Transforms the given data into a table representation.
   */
  _transformToTable = (dataMatrix: DataPoint[]) => {
    // extract existing columns
    let columns: any[] = _(dataMatrix)
      .flatten()
      .map(cMap => cMap.name)
      .uniq()
      .map(name => {
        return {
          text: name,
        };
      })
      .value();

    // create column index mapping
    const columnIndexMap = {};
    _.each(columns, (column, index) => (columnIndexMap[column.text] = index));

    // generate data rows
    let rows: any[] = _.map(dataMatrix, dataRow => {
      const row = _.times(columns.length, _.constant(null));

      _.each(dataRow, dataPoint => {
        let value: any = dataPoint.value;

        if (_.isPlainObject(value) || _.isArray(value)) {
          value = JSON.stringify(value);
        }

        row[columnIndexMap[dataPoint.name]] = value;
      });

      return row;
    });

    // create grafana result object
    return {
      columns: columns,
      rows: rows,
      type: 'table',
    };
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
  _filterData = (data: any, filters: Filter[]) => {
    return _.filter(data, dataElement =>
      _.every(filters, filter => this._matches(dataElement, filter))
    );
  };

  /**
   * Returns whether the given element matches the given filter.
   */
  _matches = (element: any, filter: Filter) => {
    const filterKey: string = filter.key;
    const matcher: string = filter.matcher;
    const filterValue: string = filter.value;

    let elementValue: any = _.get(element, filterKey);

    return FilterUtils.matchs(filterValue, matcher, elementValue);
  };

  /**
   * Resolves all existing paths of the specified selector based on the given data.
   * Example: if the selector is '*' all possible attibutes (including nested) will be returned.
   */
  resolvePaths = (selector: any, data: any) => {
    let selection: any = data;
    let lastSelector: string = '';
    let basePath = '';

    for (let i = 0; i < selector.fieldSegments.length; i++) {
      let segment: any = selector.fieldSegments[i];
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
      let paths = this._deepResolve(selection);
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
    let keys: string[] = Object.keys(data);

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
  metricFindQuery(query: string, options?: any) {
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
    const options = this._transformQueryComponentsToQueryOptions(queryComponents);

    return this.query(options, true);
  };

  /**
   * Transforms the given query components into an options object which can be used by the `query(..)` function.
   */
  _transformQueryComponentsToQueryOptions = (queryComponents: QueryComponents) => {
    const {apiKey, selectedField, filters, namespace} = queryComponents;

    const filterObjects = _.map(filters, filter => {
      return [
        {
          value: filter.key,
        },
        {
          value: filter.matcher,
        },
        {
          value: filter.value,
        },
      ];
    });

    const options = {
      targets: [
        {
          apiEndpoints: apiKey,
          queryType: 'field',
          namespace: namespace,
          fieldSelectors: [
            {
              fieldSegments: [
                {
                  value: selectedField,
                },
              ],
            },
          ],
          filterSegments: filterObjects,
        },
      ],
    };

    return options;
  };

  /**
   * Used by the config UI to test a datasource.
   */
  testDatasource() {
    return sensu
      ._request(this, 'GET', '/auth/test')
      .then(() => {
        return {
          status: 'success',
          message: 'Successfully connected against the Sensu Go API',
        };
      })
      .catch(err => {
        return {status: 'error', message: err.message};
      });
  }
}
