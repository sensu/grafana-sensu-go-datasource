export interface ConfigSettings {
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
};

export interface JsonData {
  // copy of the current datasource url - used for dynamic routing
  currentUrl: string;

  // whether an API key should be used
  useApiKey: boolean;
};

export interface SecureJsonData {
  // the specified API key
  apiKey?: string;
};

export interface SecureJsonFields {
  // whether an API key has been stored by Grafana
  apiKey?: boolean;
};