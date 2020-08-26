import _ from 'lodash';
import {DEFAULT_LIMIT, DEFAULT_AGGREGATION_LIMIT} from '../constants';

import {QueryComponents, GrafanaTarget, ServerSideFilterType} from '../types';

const CLIENT_FILTER_REG_EXP = '([^\\s:=]+)\\s*(==|=~|!=|>|<|!~|=)\\s*(\\S+)';

const SERVER_FILTER_REG_EXP =
  '(fieldSelector|labelSelector):(\\S+)\\s*(==|!=|IN|NOTIN|MATCHES)\\s*(\\[[^[]+\\]|"[^"]+"|\\S+)';

const QUERY_SINGLE_FILTER_REG_EXP =
  '(' + SERVER_FILTER_REG_EXP + '|' + CLIENT_FILTER_REG_EXP + ')';

const QUERY_FULL_REG_EXP =
  '^\\s*QUERY\\s+API\\s+(entity|events|namespaces)\\s+(IN\\s+NAMESPACE\\s+(\\S+)\\s+)?SELECT\\s+(\\S+)(\\s+WHERE\\s+(' +
  QUERY_SINGLE_FILTER_REG_EXP +
  '(\\s+AND\\s+' +
  QUERY_SINGLE_FILTER_REG_EXP +
  ')*))?(\\s+LIMIT\\s+(\\d+))?\\s*$';

/**
 * Creates a query string based on the target definition.
 * @param target the data used by the query
 */
export function targetToQueryString(target: GrafanaTarget) {
  let query: string = 'QUERY API ' + target.apiEndpoints;

  query += _namespace(target);

  if (target.queryType === 'field') {
    query += _queryTypeField(target);
  } else if (target.queryType === 'aggregation') {
    query += _queryTypeAggregation(target);
  }

  query += _whereClause(target);
  query += _limit(target);

  return query;
}

/**
 * Return the "select" statement based on the given target.
 * E.g.: SELECT field, another.field AS myField
 */
const _queryTypeField = (target: GrafanaTarget) => {
  const fields = _(target.fieldSelectors)
    .flatMap((selector) => {
      if (selector.alias) {
        return selector.getPath() + ' AS ' + selector.alias;
      } else {
        return selector.getPath();
      }
    })
    .join(', ');

  return ' SELECT ' + fields;
};

/**
 * Return the "aggregation" statement based on the given target.
 * E.g.:  AGGREGATE sum ON field
 */
const _queryTypeAggregation = (target: GrafanaTarget) => {
  let query: string = ' AGGREGATE ' + target.aggregationType;

  if (target.aggregationRequiresTarget) {
    query += ' ON ' + target.aggregationField;
  }

  return query;
};

/**
 * Return the namespace statement based on the given target.
 * E.g.:  IN NAMESPACE default
 */
const _namespace = (target: GrafanaTarget) => {
  if (target.namespace === 'default') {
    return '';
  } else {
    return ' IN NAMESPACE ' + target.namespace;
  }
};

/**
 * Return the where clause based on the given target.
 * E.g.: WHERE field=value AND status>0
 */
const _whereClause = (target: GrafanaTarget) => {
  const {clientSideFilters, serverSideFilters} = target;

  const serverFilters = _(serverSideFilters)
    .map(
      (filter) =>
        (filter.type == ServerSideFilterType.FIELD ? 'fieldSelector' : 'labelSelector') +
        ':' +
        filter.key +
        ' ' +
        filter.matcher.toUpperCase() +
        ' ' +
        filter.value
    )
    .value();

  const clientFilters = _(clientSideFilters)
    .map((filter) => filter.key + ' ' + filter.matcher + ' ' + filter.value)
    .value();

  const whereClause = _([serverFilters, clientFilters]).flatten().join(' AND ');

  if (whereClause) {
    return ' WHERE ' + whereClause;
  } else {
    return '';
  }
};

/**
 * Return the limit statement based on the given target. If no limit is specified the default limit will be used.
 * E.g.: LIMIT 100
 */
const _limit = (target: GrafanaTarget) => {
  let queryLimit: number;

  if (target.limit) {
    queryLimit = _.defaultTo(parseInt(target.limit), DEFAULT_LIMIT);
  } else {
    // Use a special default limit in aggregation queries
    if (target.queryType === 'aggregation') {
      queryLimit = DEFAULT_AGGREGATION_LIMIT;
    } else {
      queryLimit = DEFAULT_LIMIT;
    }
  }

  if (queryLimit > 0) {
    return ' LIMIT ' + queryLimit;
  } else {
    return '';
  }
};

export const extractQueryComponents = (query: string) => {
  const queryRegExp = new RegExp(QUERY_FULL_REG_EXP, 'i');
  const matchResult = query.match(queryRegExp);

  if (!matchResult) {
    return null;
  }

  let namespace: string;
  if (matchResult[3] !== undefined) {
    namespace = matchResult[3];
  } else {
    namespace = 'default';
  }

  const components: QueryComponents = {
    apiKey: matchResult[1],
    namespace: namespace,
    selectedField: matchResult[4],
    clientFilters: [],
    serverFilters: [],
    limit: parseInt(matchResult[25]),
  };

  if (matchResult[6] !== undefined) {
    const clientFilterRegExp = new RegExp('(\\s|^)' + CLIENT_FILTER_REG_EXP, 'g');
    const serverFilterRegExp = new RegExp(SERVER_FILTER_REG_EXP, 'gi');

    const clientFilters = Array.from(
      <string[]>(<any>matchResult[6]).matchAll(clientFilterRegExp)
    );

    const serverFilters = Array.from(
      <string[]>(<any>matchResult[6]).matchAll(serverFilterRegExp)
    );

    if (clientFilters !== null) {
      clientFilters.forEach((filter) =>
        components.clientFilters.push({
          key: filter[2],
          matcher: filter[3] === '=' ? '==' : filter[2], // to be downwards compatible
          value: filter[4],
        })
      );
    }

    if (serverFilters !== null) {
      serverFilters.forEach((filter) =>
        components.serverFilters.push({
          type:
            filter[1] === 'fieldSelector'
              ? ServerSideFilterType.FIELD
              : ServerSideFilterType.LABEL,
          key: filter[2],
          matcher: filter[3],
          value: filter[4],
        })
      );
    }
  }

  return components;
};

export default {targetToQueryString, extractQueryComponents};
