import AggregationType from './model/AggregationType';
import ApiEndpoint from './model/ApiEndpoint';
import TextValue from './model/TextValue';

/**
 * Supported aggregation functions.
 */
export const AGGREGATION_TYPES = <AggregationType[]>[
  {
    value: 'count',
    text: 'Count',
    requiresTarget: false,
  },
  {
    value: 'sum',
    text: 'Sum',
    requiresTarget: true,
  },
];

/**
 * Sensu API endpoints.
 */
export const API_ENDPOINTS = <ApiEndpoint[]>[
  {
    text: 'Entity API',
    value: 'entity',
    url: '/entities',
  },
  {
    text: 'Events API',
    value: 'events',
    url: '/events',
  },
];

/**
 * Supported query types.
 */
export const QUERY_TYPES = <TextValue[]>[
  {
    value: 'field',
    text: 'Field Selection',
  },
  {
    value: 'aggregation',
    text: 'Aggregation',
  },
];
