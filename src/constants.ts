import {AggregationType, ApiEndpoint, TextValue} from './types';

/**
 * The default limit.
 */
export const DEFAULT_LIMIT = 100;

/**
 * The default limit for aggregation queries.
 */
export const DEFAULT_AGGREGATION_LIMIT = 0;

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
    fieldSelectors: [
      // defined by the response filter feature (see: https://docs.sensu.io/sensu-go/latest/api/#response-filtering)
      'entity.name',
      'entity.namespace',
      'entity.deregister',
      'entity.entity_class',
      'entity.subscriptions',
    ],
  },
  {
    text: 'Events API',
    value: 'events',
    url: '/events',
    fieldSelectors: [
      'event.is_silenced',
      'event.name',
      'event.namespace',
      'event.check.handlers',
      'event.check.is_silenced',
      'event.check.name',
      'event.check.publish',
      'event.check.round_robin',
      'event.check.runtime_assets',
      'event.check.status',
      'event.check.subscriptions',
      'event.entity.deregister',
      'event.entity.entity_class',
      'event.entity.name',
      'event.entity.subscriptions',
    ],
  },
  {
    text: 'Namespaces API',
    value: 'namespaces',
    url: '/namespaces',
    fieldSelectors: ['namespace.name'],
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

/**
 * Supported result data formats.
 */
export const FORMATS = <TextValue[]>[
  {
    value: 'table',
    text: 'Table',
  },
  {
    value: 'table-v',
    text: 'Table (Vertical)',
  },
  {
    value: 'series',
    text: 'Time Series',
  },
];

/**
 * Properties containing a timestamp and should converted (from seconds to miliseconds).
 */
export const TIME_PROPERTIES: string[] = [
  'timestamp',
  'check.executed',
  'check.issued',
  'check.last_ok',
  'entity.last_seen',
  'last_seen',
];
