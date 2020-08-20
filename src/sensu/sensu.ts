import _ from 'lodash';
import {AccessToken, QueryOptions} from '../types';

/**
 * Class which encapsulates the query mechanism against the Sensu Go API.
 */
export default class Sensu {
  /**
   * The max duration a token is valid in seconds.
   */
  static readonly tokenTimeout_s = 900;
  /**
   * This duration will be susbtracted of the `tokenTimeout_s` duration.
   */
  static readonly tokenExpireOffset_s = 60;
  /**
   * The API's base url.
   */
  static readonly apiBaseUrl = '/api/core/v2';

  static readonly apiKeyUrlPrefix = '/api_key_auth';

  /**
   * Executes a query against the given datasource. An access token will be gathered if needed.
   *
   * @param datasource the datasource to use
   * @param options the options specifying the query's request
   */
  static query(datasource: any, options: QueryOptions) {
    const {method, url, namespace, limit, forceAccessTokenRefresh} = options;
    const {useApiKey} = datasource.instanceSettings.jsonData;

    if (forceAccessTokenRefresh) {
      delete datasource.instanceSettings.tokens;
    }

    let fullUrl: string;
    if (url === '/namespaces') {
      fullUrl = Sensu.apiBaseUrl + '/namespaces';
    } else {
      const namespacePath = namespace === '*' ? '' : '/namespaces/' + namespace;
      fullUrl = Sensu.apiBaseUrl + namespacePath + url;
    }

    if (limit > 0) {
      fullUrl += '?limit=' + limit;
    }

    return Sensu._authenticate(datasource)
      .then(() => Sensu._request(datasource, method, fullUrl))
      .catch(error => {
        if (!useApiKey && !forceAccessTokenRefresh) {
          // in case api tokens (not api key) are used, try to refresh the token
          Sensu.query(datasource, {...options, forceAccessTokenRefresh: true});
        } else {
          throw error;
        }
      });
  }

  /**
   * Checks whether an access token exist. If none exists or it is expired a new one will be fetched.
   * In case an api key auth is used, this method will never fetch a token.
   *
   * @param datasource the datasource to use
   */
  static _authenticate(datasource: any) {
    const {tokens, jsonData: {useApiKey}} = datasource.instanceSettings;

    // never aquire token in case of api key auth
    if (useApiKey) {
      return Promise.resolve(true);
    }

    let acquireToken = !tokens || Sensu._isTokenExpired(tokens);
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
    let timestampNow: number = Math.floor(Date.now() / 1000);
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
      let tokens: AccessToken = result.data;

      let timestampNow: number = Math.floor(Date.now() / 1000);
      let expiresOffset: number = tokens.expires_at - timestampNow - Sensu.tokenTimeout_s;

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
  static _request(datasource: any, method: string, url: string) {
    const {useApiKey} = datasource.instanceSettings.jsonData;

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
      // authetnication via bearer token
      req.url = datasource.url + url;

      if (_.has(datasource.instanceSettings, 'tokens')) {
        req.headers.Authorization =
          'Bearer ' + datasource.instanceSettings.tokens.access_token;
      }
    }

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
}
