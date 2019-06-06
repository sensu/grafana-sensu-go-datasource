import _ from 'lodash';
import AccessToken from './access_token';
import QueryOptions from './query_options';

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

  /**
   * Executes a query against the given datasource. An access token will be gathered if needed.
   *
   * @param datasource the datasource to use
   * @param options the options specifying the query's request
   */
  static query(datasource: any, options: QueryOptions) {
    const {method, url, namespace, limit, forceAccessTokenRefresh} = options;
    if (forceAccessTokenRefresh) {
      delete datasource.instanceSettings.tokens;
    }

    let fullUrl: string;
    if (url === '/namespaces') {
      fullUrl = Sensu.apiBaseUrl + '/namespaces';
    } else {
      fullUrl = Sensu.apiBaseUrl + '/namespaces/' + namespace + url;
    }

    let queryLimitString: string;
    if (limit) {
      queryLimitString = limit;
    } else {
      queryLimitString = '100';
    }

    const queryLimit = _.defaultTo(parseInt(queryLimitString), 100);
    if (queryLimit > 0) {
      fullUrl += '?limit=' + queryLimit;
    }

    return this._authenticate(datasource)
      .then(() => this._request(datasource, method, fullUrl))
      .catch(() => this.query(datasource, {...options, forceAccessTokenRefresh: true}));
  }

  /**
   * Checks whether an access token exist. If none exists or it is expired a new one will be fetched.
   *
   * @param datasource the datasource to use
   */
  static _authenticate(datasource: any) {
    const instanceSettings = datasource.instanceSettings;
    let acquireToken =
      !instanceSettings.tokens || this._isTokenExpired(instanceSettings.tokens);
    if (acquireToken) {
      return this._acquireAccessToken(datasource);
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
      expiresAt = expiresAt - token.expires_offset - this.tokenExpireOffset_s;
    }

    return expiresAt < timestampNow;
  }

  /**
   * Fetches and stores an access token.
   *
   * @param datasource the datasource to use
   */
  static _acquireAccessToken(datasource: any) {
    return this._request(datasource, 'GET', '/auth').then(result => {
      let tokens: AccessToken = result.data;

      let timestampNow: number = Math.floor(Date.now() / 1000);
      let expiresOffset: number = tokens.expires_at - timestampNow - this.tokenTimeout_s;

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
    let req: any = {
      method: method,
      url: datasource.url + url,
    };

    req.headers = {
      'Content-Type': 'application/json',
    };

    if (_.has(datasource.instanceSettings, 'tokens')) {
      req.headers.Authorization =
        'Bearer ' + datasource.instanceSettings.tokens.access_token;
    }

    return datasource.backendSrv
      .datasourceRequest(req)
      .then(this._handleRequestResult, this._handleRequestError);
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
