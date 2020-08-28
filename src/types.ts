import FieldSelector from './FieldSelector';

export interface AggregationType {
  readonly value: string;
  readonly text: string;
  readonly requiresTarget: boolean;
}

export interface ApiEndpoint {
  readonly text: string;
  readonly value: string;
  readonly url: string;
  readonly fieldSelectors: string[];
}

export interface ColumnMapping {
  path: string;
  alias: string;
}

export interface DataPoint {
  readonly value: any;
  readonly name: string;
}

export interface BaseFilter {
  key: string;
  value: string;
  matcher: string;
}

export type ClientSideFilter = BaseFilter;

export interface ServerSideFilter extends BaseFilter {
  type: ServerSideFilterType;
}

export enum ServerSideFilterType {
  FIELD = 0,
  LABEL = 1,
}

export interface InstanceSettings {
  // the datasource url
  url: string;

  // whether basic auth is used
  basicAuth: boolean;

  // additional data
  jsonData: JsonData;

  // additional secured data
  secureJsonData: SecureJsonData;

  // map defining which secured data element is set
  secureJsonFields: SecureJsonFields;
}

export interface JsonData {
  // copy of the current datasource url - used for dynamic routing
  currentUrl: string;

  // whether an API key should be used
  useApiKey: boolean;
}

export interface SecureJsonData {
  // the specified API key
  apiKey?: string;
}

export interface SecureJsonFields {
  // whether an API key has been stored by Grafana
  apiKey?: boolean;
}

export interface PreparedTarget {
  readonly apiUrl: string;
  readonly clientFilters: ClientSideFilter[];
  readonly serverFilters: ServerSideFilter[];
  readonly target: GrafanaTarget;
}

export interface QueryComponents {
  readonly apiKey: string;
  readonly namespace: string;
  readonly selectedField: string;
  readonly clientFilters: ClientSideFilter[];
  readonly serverFilters: ServerSideFilter[];
  readonly limit: number;
}

export interface TextValue {
  readonly text: string;
  readonly value: string;
}

export interface QueryOptions {
  method: string;
  url: string;
  namespaces: string[];
  limit: number;
  forceAccessTokenRefresh?: boolean;
  responseFilters: ServerSideFilter[];
}

export interface AccessToken {
  readonly access_token: string;
  readonly expires_at: number;
  readonly refresh_token: string;
  expires_offset?: number;
}

export interface GrafanaTarget {
  /** @deprecated */
  filterSegments?: any[];
  /** @deprecated */
  aggregation?: string;

  aggregationAlias?: string;
  aggregationField?: string;
  aggregationRequiresTarget?: boolean;
  aggregationType?: string;
  apiEndpoints: string;
  fieldSelectors: FieldSelector[];
  format: string;
  groupAlias?: string;
  groupBy?: string;
  limit?: string;
  namespace: string;
  namespaces: string[]; // splitted and resolved namespace attribute
  queryType: string;
  refId: string;

  version: number;
  clientSideFilters: ClientSideFilter[];
  serverSideFilters: ServerSideFilter[];
}

export interface GrafanaUiSegment {
  value: string;
}

export interface GrafanaTimeSeries {
  target: string; // time series name
  datapoints: unknown[];
}

export interface GrafanaTable {
  columns: unknown[];
  rows: unknown[][];
  type: string;
}
