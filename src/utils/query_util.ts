import _ from 'lodash';

import QueryComponents from '../model/QueryComponents';

/**
 * The default limit.
 */
const DEFAULT_LIMIT: number = 100;

const QUERY_FULL_REG_EXP = /QUERY\s+API\s+(entity|events|namespaces)\s+(IN\s+NAMESPACE\s+(\S+)\s+)?SELECT\s+(\S+)(\s+WHERE\s+(\S+\s*(=~?|!=|>|<|!=)\s*\S+(\s+AND\s+\S+\s*(=~?|!=|>|<|!=)\s*\S+)*))?/;
const QUERY_SINGLE_FILTER_REG_EXP = /(\S+)\s*(=~?|!=|>|<|!~)\s*(\S+)/g;

/**
 * Creates a query string based on the target definition.
 * @param target the data used by the query
 */
export function targetToQueryString(target) {
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
const _queryTypeField = (target: any) => {
  const fields = _(target.fieldSelectors)
    .flatMap(selector => {
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
const _queryTypeAggregation = (target: any) => {
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
const _namespace = (target: any) => {
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
const _whereClause = (target: any) => {
  const whereClause = _(target.filterSegments)
    .filter(segments => segments.length === 3)
    .filter(segments => !segments[2].fake)
    .map(s => s[0].value + s[1].value + s[2].value)
    .join(' AND ');

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
const _limit = (target: any) => {
  let queryLimit = target.limit;
  if (!target.limit) {
    queryLimit = DEFAULT_LIMIT;
  }

  queryLimit = _.defaultTo(parseInt(queryLimit), DEFAULT_LIMIT);
  if (queryLimit > 0) {
    return ' LIMIT ' + queryLimit;
  } else {
    return '';
  }
};

export const extractQueryComponents = (query: string) => {
  const matchResult = query.match(QUERY_FULL_REG_EXP);

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
    filters: [],
  };

  if (matchResult[6] !== undefined) {
    const filters = Array.from(
      (<any>matchResult[6]).matchAll(QUERY_SINGLE_FILTER_REG_EXP)
    );

    if (filters !== null) {
      for (let i in filters) {
        components.filters.push({
          key: filters[i][1],
          matcher: filters[i][2],
          value: filters[i][3],
        });
      }
    }
  }

  return components;
};

export default { targetToQueryString, extractQueryComponents };
