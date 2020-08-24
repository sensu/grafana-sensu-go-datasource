export interface AggregationType {
  readonly value: string;
  readonly text: string;
  readonly requiresTarget: boolean;
}

export interface ApiEndpoint {
  readonly text: string;
  readonly value: string;
  readonly url: string;
}

export interface ColumnMapping {
  path: string;
  alias: string;
}

export interface DataPoint {
  readonly value: any;
  readonly name: string;
}

export interface Filter {
  readonly key: string;
  readonly value: string;
  readonly matcher: string;
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
  readonly filters: Filter[];
  readonly target: any;
}

export interface QueryComponents {
  readonly apiKey: string;
  readonly namespace: string;
  readonly selectedField: string;
  readonly filters: Filter[];
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
}

export interface AccessToken {
  readonly access_token: string;
  readonly expires_at: number;
  readonly refresh_token: string;
  expires_offset?: number;
}
