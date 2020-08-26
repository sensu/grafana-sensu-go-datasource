import _ from 'lodash';
import {
  AccessToken,
  QueryOptions,
  ServerSideFilter,
  ServerSideFilterType,
} from '../types';

/**
 * Class which encapsulates the query mechanism against the Sensu Go API.
 */
export default class Sensu {
  /**
   * The max duration a token is valid in seconds.
   */
  static readonly tokenTimeout_s = 600;
  /**
   * This duration will be susbtracted of the `tokenTimeout_s` duration.
   */
  static readonly tokenExpireOffset_s = 60;
  /**
   * The API's base url.
   */
  static readonly apiBaseUrl = '/api/core/v2';

  /**
   * The data source route used for API key authentication. See also the plugin.json file.
   */
  static readonly apiKeyUrlPrefix = '/api_key_auth';

  /**
   * Executes a query against the given datasource. An access token will be gathered if needed.
   * For each namespace specified in the passed options, a separate query will be executed.
   *
   * @param datasource the datasource to use
   * @param options the options specifying the query's request
   */
  static query(datasource: any, options: QueryOptions) {
    const {namespaces} = options;

    if (_.isEmpty(namespaces) && options.url === '/namespaces') {
      namespaces.push(''); // dummy element to execute a query
    }

    const queries = _.map(namespaces, namespace =>
      this._doQuery(datasource, options, namespace)
    );

    return Promise.all(queries).then(data => {
      return _.flatten(data);
    });
  }

  /**
   * Executes a query against the given datasource. An access token will be gathered if needed.
   *
   * @param datasource the datasource to use
   * @param options the options specifying the query's request
   * @param namespace the namespace used by this query
   */
  static _doQuery(
    datasource: any,
    options: QueryOptions,
    namespace: string,
    retryCount = 0
  ) {
    const {method, url} = options;

    let fullUrl: string;
    if (url === '/namespaces') {
      fullUrl = Sensu.apiBaseUrl + '/namespaces';
    } else {
      const namespacePath = namespace === '*' ? '' : '/namespaces/' + namespace;
      fullUrl = Sensu.apiBaseUrl + namespacePath + url;
    }

    const requestParameters = this._getParameters(options);

    return Sensu._authenticate(datasource)
      .then(() => Sensu._request(datasource, method, fullUrl, requestParameters))
      .then(result => result.data)
      .catch(error => {
        // we'll retry once
        if (retryCount >= 1) {
          throw error;
        }

        // delete token details in order to refresh the token in case of basic auth
        delete datasource.instanceSettings.tokens;

        // the retry is not immediatly done in order to prevent some race conditions
        const delay = Math.floor(1000 + Math.random() * 1000);

        return new Promise(resolve => setTimeout(resolve, delay)).then(() =>
          this._doQuery(datasource, options, namespace, retryCount + 1)
        );
      });
  }

  /**
   * Checks whether an access token exist. If none exists or it is expired a new one will be fetched.
   * In case an api key auth is used, this method will never fetch a token.
   *
   * @param datasource the datasource to use
   */
  static _authenticate(datasource: any) {
    const {tokens} = datasource.instanceSettings;
    const useApiKey = _.get(datasource.instanceSettings, 'jsonData.useApiKey', false);

    // never aquire token in case of api key auth
    if (useApiKey) {
      return Promise.resolve(true);
    }

    const acquireToken = !tokens || Sensu._isTokenExpired(tokens);
    if (acquireToken) {
      return Sensu._acquireAccessToken(datasource);
    } else {
      return Promise.resolve(true);
    }
  }

  /**
   * Returns whether the given token is already expired.
   *
   * @param token the token to check
   */
  static _isTokenExpired(token: AccessToken) {
    const timestampNow: number = Math.floor(Date.now() / 1000);
    let expiresAt: number = token.expires_at;

    if (token.expires_offset) {
      expiresAt = expiresAt - token.expires_offset - Sensu.tokenExpireOffset_s;
    }

    return expiresAt < timestampNow;
  }

  /**
   * Fetches and stores an access token.
   *
   * @param datasource the datasource to use
   */
  static _acquireAccessToken(datasource: any) {
    return Sensu._request(datasource, 'GET', '/auth').then(result => {
      const tokens: AccessToken = result.data;

      const timestampNow: number = Math.floor(Date.now() / 1000);
      const expiresOffset: number =
        tokens.expires_at - timestampNow - Sensu.tokenTimeout_s;

      tokens.expires_offset = expiresOffset;

      datasource.instanceSettings.tokens = tokens;
    });
  }

  /**
   * Executes a (potential authenticated) request against the specified url using the given datasource (server) and HTTP method.
   *
   * @param datasource the datasource to use
   * @param method the method of the HTTP request (GET, POST, ...)
   * @param url the url to send the request to
   */
  static _request(
    datasource: any,
    method: string,
    url: string,
    requestParameters: Record<string, string> = {}
  ) {
    const useApiKey = _.get(datasource.instanceSettings, 'jsonData.useApiKey', false);

    const req: any = {
      method: method,
    };

    req.headers = {
      'Content-Type': 'application/json',
    };

    if (useApiKey) {
      // authentication via api key using authentication route
      req.url = datasource.url + Sensu.apiKeyUrlPrefix + url;
    } else {
      // authentication via bearer token
      req.url = datasource.url + url;

      if (_.has(datasource.instanceSettings, 'tokens')) {
        req.headers.Authorization =
          'Bearer ' + datasource.instanceSettings.tokens.access_token;
      }
    }

    req.params = requestParameters;

    return datasource.backendSrv
      .datasourceRequest(req)
      .then(Sensu._handleRequestResult, Sensu._handleRequestError);
  }

  /**
   * Is called when the request is ending successfully. In case of a 401 error, the request is not throwing an error but returning no result object.
   *
   * @param result the request's result object
   */
  static _handleRequestResult(result: any) {
    if (result) {
      return result;
    } else {
      throw {
        message: 'Credentials Invalid: Could not logged in using credentials',
        data: 'access_error',
      };
    }
  }

  /**
   * Is called if the request's promise is getting an error.
   *
   * @param err the request's error object
   */
  static _handleRequestError(err: any) {
    if (err.status !== 0 || err.status >= 300) {
      if (err.data && err.data.error) {
        throw {
          message: 'Sensu Go Error: ' + err.data.error,
          data: err.data,
          config: err.config,
        };
      } else {
        throw {
          message: 'Network Error: ' + err.statusText + '(' + err.status + ')',
          data: err.data,
          config: err.config,
        };
      }
    }
  }

  /**
   * Returns an object which represents the request parameters that should be used
   * by the request representing the data source query.
   *
   * @param options the query options to use as basis for the parameters
   */
  static _getParameters(options: QueryOptions) {
    const {limit, responseFilters} = options;
    const result: any = {};

    // build the response filter parameters
    const fieldSelector = this._buildFilterParameter(
      responseFilters.filter(filter => filter.type === ServerSideFilterType.FIELD)
    );
    if (fieldSelector !== '') {
      result.fieldSelector = fieldSelector;
    }

    const labelSelector = this._buildFilterParameter(
      responseFilters.filter(filter => filter.type === ServerSideFilterType.LABEL)
    );
    if (labelSelector !== '') {
      result.labelSelector = labelSelector;
    }

    // build the limit option
    if (limit > 0) {
      result.limit = limit;
    }

    return result;
  }

  /**
   * Creates the parameter value for a response (server-side) filter. More details regarding its
   * format can be found in the documentation: https://docs.sensu.io/sensu-go/latest/api/#response-filtering
   *
   * @param filters the filters which will be included in the filter parameter
   */
  static _buildFilterParameter(filters: ServerSideFilter[]) {
    return _(filters)
      .map(filter => filter.key + ' ' + filter.matcher + ' ' + filter.value)
      .join(' && ');
  }
}
