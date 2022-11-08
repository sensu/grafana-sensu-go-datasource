define(['lodash', 'moment', 'app/core/app_events', 'app/plugins/sdk'], function(
  e,
  t,
  r,
  n
) {
  return (function(e) {
    var t = {};
    function r(n) {
      if (t[n]) return t[n].exports;
      var a = (t[n] = {i: n, l: !1, exports: {}});
      return e[n].call(a.exports, a, a.exports, r), (a.l = !0), a.exports;
    }
    return (
      (r.m = e),
      (r.c = t),
      (r.d = function(e, t, n) {
        r.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: n});
      }),
      (r.r = function(e) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, {value: 'Module'}),
          Object.defineProperty(e, '__esModule', {value: !0});
      }),
      (r.t = function(e, t) {
        if ((1 & t && (e = r(e)), 8 & t)) return e;
        if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
        var n = Object.create(null);
        if (
          (r.r(n),
          Object.defineProperty(n, 'default', {enumerable: !0, value: e}),
          2 & t && 'string' != typeof e)
        )
          for (var a in e)
            r.d(
              n,
              a,
              function(t) {
                return e[t];
              }.bind(null, a)
            );
        return n;
      }),
      (r.n = function(e) {
        var t =
          e && e.__esModule
            ? function() {
                return e.default;
              }
            : function() {
                return e;
              };
        return r.d(t, 'a', t), t;
      }),
      (r.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (r.p = ''),
      r((r.s = 4))
    );
  })([
    function(t, r) {
      t.exports = e;
    },
    function(e, r) {
      e.exports = t;
    },
    function(e, t) {
      e.exports = r;
    },
    function(e, t) {
      e.exports = n;
    },
    function(e, t, r) {
      'use strict';
      r.r(t),
        r.d(t, 'Datasource', function() {
          return T;
        }),
        r.d(t, 'QueryCtrl', function() {
          return q;
        }),
        r.d(t, 'ConfigCtrl', function() {
          return C;
        });
      var n,
        a,
        i = r(0),
        u = r.n(i);
      ((a = n || (n = {}))[(a.FIELD = 0)] = 'FIELD'), (a[(a.LABEL = 1)] = 'LABEL');
      var s = (function() {
          function e() {}
          return (
            (e.query = function(e, t) {
              var r = this,
                n = t.namespaces;
              u.a.isEmpty(n) && '/namespaces' === t.url && n.push('');
              var a = u.a.map(n, function(n) {
                return r._doQuery(e, t, n);
              });
              return Promise.all(a).then(function(e) {
                return u.a.flatten(e);
              });
            }),
            (e._doQuery = function(t, r, n, a) {
              var i = this;
              void 0 === a && (a = 0);
              var u,
                s = r.method,
                l = r.url;
              u =
                '/namespaces' === l
                  ? e.apiBaseUrl + '/namespaces'
                  : e.apiBaseUrl + ('*' === n ? '' : '/namespaces/' + n) + l;
              var o = this._getParameters(r);
              return e
                ._authenticate(t)
                .then(function() {
                  return e._request(t, s, u, o);
                })
                .then(function(e) {
                  return e.data;
                })
                .catch(function(e) {
                  if (1 <= a) throw e;
                  delete t.instanceSettings.tokens;
                  var u = Math.floor(1e3 + 1e3 * Math.random());
                  return new Promise(function(e) {
                    return setTimeout(e, u);
                  }).then(function() {
                    return i._doQuery(t, r, n, a + 1);
                  });
                });
            }),
            (e._authenticate = function(t) {
              var r = t.instanceSettings.tokens;
              return u.a.get(t.instanceSettings, 'jsonData.useApiKey', !1)
                ? Promise.resolve(!0)
                : !r || e._isTokenExpired(r)
                  ? e._acquireAccessToken(t)
                  : Promise.resolve(!0);
            }),
            (e._isTokenExpired = function(t) {
              var r = Math.floor(Date.now() / 1e3),
                n = t.expires_at;
              return (
                t.expires_offset && (n = n - t.expires_offset - e.tokenExpireOffset_s),
                n < r
              );
            }),
            (e._acquireAccessToken = function(t) {
              return e._request(t, 'GET', '/auth').then(function(r) {
                var n = r.data,
                  a = Math.floor(Date.now() / 1e3),
                  i = n.expires_at - a - e.tokenTimeout_s;
                (n.expires_offset = i), (t.instanceSettings.tokens = n);
              });
            }),
            (e._request = function(t, r, n, a) {
              void 0 === a && (a = {});
              var i = {method: r, headers: {'Content-Type': 'application/json'}};
              return (
                u.a.get(t.instanceSettings, 'jsonData.useApiKey', !1)
                  ? (i.url = t.url + e.apiKeyUrlPrefix + n)
                  : ((i.url = t.url + n),
                    u.a.has(t.instanceSettings, 'tokens') &&
                      (i.headers.Authorization =
                        'Bearer ' + t.instanceSettings.tokens.access_token)),
                (i.params = a),
                t.backendSrv
                  .datasourceRequest(i)
                  .then(e._handleRequestResult, e._handleRequestError)
              );
            }),
            (e._handleRequestResult = function(e) {
              if (e) return e;
              throw {
                message: 'Credentials Invalid: Could not logged in using credentials',
                data: 'access_error',
              };
            }),
            (e._handleRequestError = function(e) {
              if (0 !== e.status || 300 <= e.status)
                throw e.data && e.data.message
                  ? {
                      message: 'Sensu Go Error: ' + e.data.message,
                      data: e.data,
                      config: e.config,
                    }
                  : {
                      message: 'Network Error: ' + e.statusText + '(' + e.status + ')',
                      data: e.data,
                      config: e.config,
                    };
            }),
            (e._getParameters = function(e) {
              var t = e.limit,
                r = e.responseFilters,
                a = {},
                i = this._buildFilterParameter(
                  r.filter(function(e) {
                    return e.type === n.FIELD;
                  })
                );
              '' !== i && (a.fieldSelector = i);
              var u = this._buildFilterParameter(
                r.filter(function(e) {
                  return e.type === n.LABEL;
                })
              );
              return '' !== u && (a.labelSelector = u), 0 < t && (a.limit = t), a;
            }),
            (e._buildFilterParameter = function(e) {
              var t = this;
              return u()(e)
                .map(function(e) {
                  return (
                    e.key + ' ' + e.matcher + ' ' + t._parseGrafanaMultiValue(e.value)
                  );
                })
                .join(' && ');
            }),
            (e._parseGrafanaMultiValue = function(e) {
              return (
                this.grafanaMultiValueRegex.test(e) &&
                  (e = e
                    .replace(/\(/g, '[')
                    .replace(/\)/g, ']')
                    .replace(/\|/g, ',')),
                e
              );
            }),
            (e.tokenTimeout_s = 600),
            (e.tokenExpireOffset_s = 60),
            (e.apiBaseUrl = '/api/core/v2'),
            (e.apiKeyUrlPrefix = '/api_key_auth'),
            (e.grafanaMultiValueRegex = new RegExp(/^\s*[(].*[|].*[)]\s*$/g)),
            e
          );
        })(),
        l = [
          {value: 'count', text: 'Count', requiresTarget: !1},
          {value: 'sum', text: 'Sum', requiresTarget: !0},
        ],
        o = [
          {
            text: 'Entity API',
            value: 'entity',
            url: '/entities',
            fieldSelectors: [
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
        ],
        c = [
          {value: 'field', text: 'Field Selection'},
          {value: 'aggregation', text: 'Aggregation'},
        ],
        g = [
          {value: 'table', text: 'Table'},
          {value: 'table-v', text: 'Table (Vertical)'},
          {value: 'series', text: 'Time Series'},
        ],
        f = [
          'timestamp',
          'check.executed',
          'check.issued',
          'check.last_ok',
          'entity.last_seen',
          'last_seen',
        ],
        p = function(e) {
          var t = e.match(/\/(.*)\/(\w*)/);
          return t ? new RegExp(t[1], t[2]) : new RegExp(e);
        },
        v = function(e, t, r) {
          if ('==' === t) return e == r;
          if ('!=' === t) return e != r;
          if ('=~' === t || '!~' === t)
            return (function(e, t, r) {
              var n = p(e);
              return '=~' === t ? n.test(r) : !n.test(r);
            })(e, t, r);
          if ('<' === t || '>' === t)
            return (function(e, t, r) {
              var n = Number(e);
              return u.a.isFinite(n)
                ? '<' === t ? r < n : n < r
                : (console.warn(
                    'The specified filter value (' +
                      e +
                      ') is not compatible to filter on a numeric attribute.'
                  ),
                  !1);
            })(e, t, r);
          throw 'Unsupported operator "' + t + '"';
        };
      var m,
        d = r(1),
        S = r.n(d),
        h = function(e) {
          u.a.each(e, function(e) {
            for (var t = e[0], r = e[1], n = 0; n < f.length; n++)
              if (t === f[n]) {
                var a = u.a.defaultTo(r, -1);
                0 < a && (e[1] = S()(a).format('YYYY-MM-DD HH:mm:ss'));
                break;
              }
          });
        },
        y = function(e, t) {
          var r = (function(e) {
              var t = {};
              return u()(e)
                .flatten()
                .map(function(e) {
                  var r = e.name,
                    n = e.value;
                  return u.a.isArray(n)
                    ? ((t[r] = !0),
                      u.a.times(n.length, function(e) {
                        return r + '[' + e + ']';
                      }))
                    : u.a.isNil(n) && u.a.get(t, r, !1) ? [] : [r];
                })
                .flatten()
                .uniq()
                .map(function(e) {
                  return {text: e};
                })
                .value();
            })(e),
            n = {};
          u.a.each(r, function(e, t) {
            return (n[e.text] = t);
          });
          var a = u.a.map(e, function(e) {
            var t = u.a.times(r.length, u.a.constant(null));
            return (
              u()(e)
                .map(function(e) {
                  var t = e.name,
                    r = e.value;
                  return u.a.isArray(r)
                    ? u.a.map(r, function(e, r) {
                        return [t + '[' + r + ']', e];
                      })
                    : [[t, r]];
                })
                .flatten()
                .map(function(e) {
                  return (
                    (u.a.isPlainObject(e[1]) || u.a.isArray(e[1])) &&
                      (e[1] = JSON.stringify(e[1])),
                    e
                  );
                })
                .each(function(e) {
                  var r = e[0],
                    a = e[1];
                  t[n[r]] = a;
                }),
              t
            );
          });
          return t
            ? (function(e, t) {
                var r = u()(t)
                  .flatten()
                  .map(function(t, r) {
                    return [e[r].text, t];
                  })
                  .value();
                return (
                  h(r),
                  {
                    columns: [{text: 'Attribute'}, {text: 'Value'}],
                    rows: r,
                    type: 'table',
                  }
                );
              })(r, a)
            : {columns: r, rows: a, type: 'table'};
        },
        _ = function(e, t) {
          return y(e, t);
        },
        F = function(e) {
          return (function(e) {
            var t = Date.now();
            return u()(e)
              .flatten()
              .filter(function(e) {
                return u.a.isFinite(e.value);
              })
              .map(function(e) {
                return {target: e.name, datapoints: [[e.value, t]]};
              })
              .value();
          })(e);
        },
        w = function(e) {
          var t = e.version;
          return (
            void 0 === t &&
              (function(e) {
                (e.version = 2), (e.clientSideFilters = []), (e.serverSideFilters = []);
              })(e),
            1 === t &&
              (function(e) {
                console.log('Migrating data source configuration to version 2.');
                var t = e.filterSegments,
                  r = u()(t)
                    .filter(function(e) {
                      return 3 === e.length;
                    })
                    .filter(function(e) {
                      return !u.a.get(e[2], 'fake', !1);
                    })
                    .map(function(e) {
                      var t = '=' === e[1].value ? '==' : e[1].value;
                      return {key: e[0].value, matcher: t, value: e[2].value};
                    })
                    .value();
                delete e.filterSegments,
                  (e.clientSideFilters = r),
                  (e.serverSideFilters = []),
                  (e.version = 2);
              })(e),
            e
          );
        },
        T = (function() {
          function e(e, t, r) {
            var a = this;
            (this.instanceSettings = e),
              (this.backendSrv = t),
              (this.templateSrv = r),
              (this.prepareQuery = function(e, t) {
                var r = {
                  apiUrl: a._getApiUrl(e),
                  clientFilters: u.a.cloneDeep(e.clientSideFilters),
                  serverFilters: u.a.cloneDeep(e.serverSideFilters),
                  target: u.a.cloneDeep(e),
                };
                return a._resolveTemplateVariables(r, t), r;
              }),
              (this._resolveTemplateVariables = function(e, t) {
                var r = e.target,
                  n = e.clientFilters,
                  i = e.serverFilters,
                  u = a.templateSrv.replace(r.namespace, t.scopedVars, 'pipe').split('|');
                (r.namespaces = u),
                  [n, i].forEach(function(e) {
                    return e.forEach(function(e) {
                      (e.key = a.templateSrv.replace(e.key, t.scopedVars, 'csv')),
                        (e.value = a.templateSrv.replace(e.value, t.scopedVars, 'regex'));
                    });
                  });
              }),
              (this._getApiUrl = function(e) {
                var t = u.a.find(o, {value: e.apiEndpoints});
                return t ? t.url : o[0].url;
              }),
              (this._timeCorrection = function(e) {
                return (
                  u.a.each(e, function(e) {
                    u.a.each(f, function(t) {
                      var r = u.a.get(e, t, -1);
                      0 < r ? u.a.set(e, t, 1e3 * r) : u.a.unset(e, t);
                    });
                  }),
                  e
                );
              }),
              (this._queryGroupAndAggregate = function(e, t) {
                var r = t.target,
                  n = r.aggregationAlias,
                  i = r.aggregationType,
                  s = r.format,
                  l = r.groupBy,
                  o = n || i || 'value';
                if (l) {
                  var c = u.a.groupBy(e, l),
                    g = u()(c)
                      .map(function(e, r) {
                        return a._queryAggregation(e, r, t);
                      })
                      .value();
                  if (('table' !== s && 'table-v' !== s) || !g) return g;
                  var f = t.target.groupAlias;
                  return a._mergeTableAggregation(g, f || l, o);
                }
                return [a._queryAggregation(e, o, t)];
              }),
              (this._mergeTableAggregation = function(e, t, r) {
                return u()(e)
                  .map(function(e) {
                    if (!e || 0 == e.length) return null;
                    var n = e[0];
                    return [{name: t, value: n.name}, {name: r, value: n.value}];
                  })
                  .filter()
                  .value();
              }),
              (this._queryAggregation = function(e, t, r) {
                var n = r.target.aggregationType;
                if ('count' === n)
                  return (function(e, t) {
                    return [{name: t, value: e.length}];
                  })(e, t);
                if ('sum' !== n)
                  throw new Error('The aggreation type "' + n + '" is not supported.');
                return (function(e, t, r) {
                  if (!r) return [];
                  var n = u.a.sumBy(e, r);
                  return u.a.isFinite(n) || (n = null), [{name: t, value: n}];
                })(e, t, r.target.aggregationField);
              }),
              (this._queryFieldSelection = function(e, t) {
                var r = a._extractColumnMappings(e, t);
                return u.a.map(e, function(e) {
                  return u.a.map(r, function(t) {
                    var r = u.a.get(e, t.path);
                    return {name: t.alias, value: r};
                  });
                });
              }),
              (this._extractColumnMappings = function(e, t) {
                return u.a.flatMap(t, function(t) {
                  var r = u()(e)
                    .map(function(e) {
                      return a.resolvePaths(t, e);
                    })
                    .flatMap()
                    .uniq()
                    .value();
                  return t.alias
                    ? 1 < r.length
                      ? u.a.map(r, function(e, r) {
                          return {path: e, alias: t.alias + '.' + r};
                        })
                      : u.a.map(r, function(e) {
                          return {path: e, alias: t.alias};
                        })
                    : u.a.map(r, function(e) {
                        return {path: e, alias: e};
                      });
                });
              }),
              (this._filterData = function(e, t) {
                return u.a.filter(e, function(e) {
                  return u.a.every(t, function(t) {
                    return a._matches(e, t);
                  });
                });
              }),
              (this._matches = function(e, t) {
                var r = t.key,
                  n = t.matcher,
                  a = t.value,
                  i = u.a.get(e, r);
                return v(a, n, i);
              }),
              (this.resolvePaths = function(e, t) {
                for (var r = t, n = '', i = '', s = 0; s < e.fieldSegments.length; s++)
                  '*' !== (n = e.fieldSegments[s].value) &&
                    ((i = '' === i ? n : i + '.' + n), (r = u.a.get(r, n)));
                if ('*' !== n) return [i];
                var l = a._deepResolve(r);
                return '' === i
                  ? l
                  : u.a.map(l, function(e) {
                      return i + '.' + e;
                    });
              }),
              (this._deepResolve = function(e) {
                var t = Object.keys(e);
                return u.a.flatMap(t, function(t) {
                  return u.a.isPlainObject(e[t])
                    ? u.a.map(a._deepResolve(e[t]), function(e) {
                        return t + '.' + e;
                      })
                    : t;
                });
              }),
              (this._query = function(e) {
                var t = (function(e) {
                  var t,
                    r = new RegExp(
                      '^\\s*QUERY\\s+API\\s+(entity|events|namespaces)\\s+(IN\\s+NAMESPACE\\s+(\\S+)\\s+)?SELECT\\s+(\\S+)(\\s+WHERE\\s+(((fieldSelector|labelSelector):(\\[[^[]+\\]|"[^"]+"|\\S+)\\s*(==|!=|IN|NOTIN|MATCHES)\\s*(\\[[^[]+\\]|"[^"]+"|\\S+)|([^\\s:=!]+)\\s*(==|=~|!=|>|<|!~|=)\\s*(\\S+))(\\s+AND\\s+((fieldSelector|labelSelector):(\\[[^[]+\\]|"[^"]+"|\\S+)\\s*(==|!=|IN|NOTIN|MATCHES)\\s*(\\[[^[]+\\]|"[^"]+"|\\S+)|([^\\s:=!]+)\\s*(==|=~|!=|>|<|!~|=)\\s*(\\S+)))*))?(\\s+LIMIT\\s+(\\d+))?\\s*$',
                      'i'
                    ),
                    a = e.match(r);
                  if (!a) return null;
                  t = void 0 !== a[3] ? a[3] : 'default';
                  var i = {
                    apiKey: a[1],
                    namespace: t,
                    selectedField: a[4],
                    clientFilters: [],
                    serverFilters: [],
                    limit: parseInt(a[25]),
                  };
                  if (void 0 !== a[6])
                    for (
                      var u = new RegExp(
                          '(fieldSelector|labelSelector):(\\[[^[]+\\]|"[^"]+"|\\S+)\\s*(==|!=|IN|NOTIN|MATCHES)\\s*(\\[[^[]+\\]|"[^"]+"|\\S+)|([^\\s:=!]+)\\s*(==|=~|!=|>|<|!~|=)\\s*(\\S+)',
                          'gi'
                        ),
                        s = a[6],
                        l = void 0;
                      null !== (l = u.exec(s));

                    )
                      if (void 0 !== l[1]) {
                        var o = {
                          type: 'fieldSelector' === l[1] ? n.FIELD : n.LABEL,
                          key: l[2],
                          matcher: l[3],
                          value: l[4],
                        };
                        i.serverFilters.push(o);
                      } else
                        (o = {
                          key: l[5],
                          matcher: '=' === l[6] ? '==' : l[6],
                          value: l[7],
                        }),
                          i.clientFilters.push(o);
                  return i;
                })(e);
                if (null === t) return Promise.resolve([]);
                var r = a._transformQueryComponentsToQueryOptions(t);
                return (r.resultAsPlainArray = !0), a.query(r);
              }),
              (this._transformQueryComponentsToQueryOptions = function(e) {
                var t = e.apiKey,
                  r = e.selectedField,
                  n = e.clientFilters,
                  a = e.serverFilters,
                  i = e.namespace,
                  s = e.limit;
                return {
                  targets: [
                    {
                      apiEndpoints: t,
                      queryType: 'field',
                      namespace: i,
                      limit: u.a.isNaN(s) ? null : new String(s),
                      fieldSelectors: [{fieldSegments: [{value: r}]}],
                      format: 'table',
                      clientSideFilters: n,
                      serverSideFilters: a,
                      version: 2,
                    },
                  ],
                };
              }),
              (this.url = e.url.trim());
          }
          return (
            (e.$inject = ['instanceSettings', 'backendSrv', 'templateSrv']),
            (e.prototype.query = function(e) {
              var t = this,
                r = u()(e.targets)
                  .filter(function(e) {
                    return !e.hide;
                  })
                  .map(w)
                  .map(function(r) {
                    return t.prepareQuery(r, e);
                  })
                  .value();
              if (0 === r.length) return Promise.resolve({data: []});
              var n = r.map(function(e) {
                var r = e.apiUrl,
                  n = e.clientFilters,
                  a = e.serverFilters,
                  i = e.target,
                  l = i.queryType,
                  o = i.fieldSelectors,
                  c = i.namespaces,
                  g = i.limit,
                  f = u.a.defaultTo(parseInt(g || ''), -1);
                f < 0 && (f = 'aggregation' === l ? 0 : 100);
                var p = {
                  method: 'GET',
                  url: r,
                  namespaces: c,
                  limit: f,
                  responseFilters: a,
                };
                return s
                  .query(t, p)
                  .then(t._timeCorrection)
                  .then(function(e) {
                    return t._filterData(e, n);
                  })
                  .then(function(r) {
                    return 'field' === l
                      ? t._queryFieldSelection(r, o)
                      : 'aggregation' === l ? t._queryGroupAndAggregate(r, e) : [];
                  });
              });
              return Promise.all(n).then(function(t) {
                return e.resultAsPlainArray
                  ? u()(t)
                      .map(function(e) {
                        return _(e, !1);
                      })
                      .map(function(e) {
                        return e.rows;
                      })
                      .flatten()
                      .flatten()
                      .filter()
                      .map(function(e) {
                        return {text: e};
                      })
                      .value()
                  : {
                      data: u.a.flatMap(t, function(e, t) {
                        var n = r[t].target.format;
                        return 'series' === n ? F(e) : _(e, 'table-v' === n);
                      }),
                    };
              });
            }),
            (e.prototype.metricFindQuery = function(e) {
              return this._query(e);
            }),
            (e.prototype.testDatasource = function() {
              var e = u.a.get(this.instanceSettings, 'jsonData.useApiKey', !1),
                t = e ? '/api/core/v2/namespaces' : '/auth/test';
              return s
                ._request(this, 'GET', t)
                .then(function() {
                  return {
                    status: 'success',
                    message: 'Successfully connected against the Sensu Go API',
                  };
                })
                .catch(function(t) {
                  return e && 'access_error' === t.data
                    ? {
                        status: 'error',
                        message: 'API Key Invalid: Could not logged in using API key',
                      }
                    : {status: 'error', message: t.message};
                });
            }),
            e
          );
        })(),
        A = r(2),
        b = r.n(A),
        P = r(3),
        k = (function() {
          function e(e, t) {
            var r = this;
            (this.refresh = function(e) {
              if (e.dataPreview && !(e.dataPreview.length <= 0)) {
                for (var t = e.dataPreview[0], n = 0; n < r.fieldSegments.length; n++) {
                  var a = r.fieldSegments[n].value;
                  t && (t = u.a.get(t, a)),
                    '*' === a && (r.fieldSegments = r.fieldSegments.slice(0, n + 1));
                }
                void 0 === t
                  ? (r.fieldType = 'undefined')
                  : u.a.isPlainObject(t)
                    ? (r.fieldSegments.push(e.uiSegmentSrv.newKey('*')),
                      (r.fieldType = 'object'))
                    : u.a.isArray(t)
                      ? (r.fieldType = 'array')
                      : (r.fieldType = 'number' == typeof t ? 'number' : 'string'),
                  (r.attributePath = r.getPath());
              }
            }),
              (this.getPath = function() {
                return u()(r.fieldSegments)
                  .map(function(e) {
                    return e.value;
                  })
                  .join('.');
              }),
              (this.fieldSegments = u.a.map(t.split('.'), function(t) {
                return e.uiSegmentSrv.newKey(t);
              })),
              this.refresh(e);
          }
          return (
            (e.restore = function(t, r) {
              var n = new e(
                t,
                u()(r.fieldSegments)
                  .map(function(e) {
                    return e.value;
                  })
                  .join('.')
              );
              return (n.alias = r.alias), n;
            }),
            e
          );
        })(),
        E = ((m = function(e, t) {
          return (m =
            Object.setPrototypeOf ||
            ({__proto__: []} instanceof Array &&
              function(e, t) {
                e.__proto__ = t;
              }) ||
            function(e, t) {
              for (var r in t)
                Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            })(e, t);
        }),
        function(e, t) {
          function r() {
            this.constructor = e;
          }
          m(e, t),
            (e.prototype =
              null === t ? Object.create(t) : ((r.prototype = t.prototype), new r()));
        }),
        q = (function(e) {
          function t(t, r, a, i, f) {
            var p = e.call(this, t, r) || this;
            (p.$q = a),
              (p.uiSegmentSrv = i),
              (p.templateSrv = f),
              (p.aggregationTypes = l),
              (p.queryTypes = c),
              (p.formats = g),
              (p.dataPreview = {}),
              (p.dataPreviewBuffer = []),
              (p.apiEndpoints = o),
              (p.clientFilterSegments = []),
              (p.serverFilterSegments = []),
              (p._createClientFilterSegments = function(e) {
                return [
                  p.uiSegmentSrv.newKey(e.key),
                  p.uiSegmentSrv.newOperator(e.matcher),
                  p.uiSegmentSrv.newKeyValue(e.value),
                ];
              }),
              (p._createServerFilterSegments = function(e) {
                var t = e.type === n.FIELD ? 'fieldSelector' : 'labelSelector';
                return [
                  p.uiSegmentSrv.newCondition(t),
                  p.uiSegmentSrv.newKey(e.key),
                  p.uiSegmentSrv.newOperator(e.matcher),
                  p.uiSegmentSrv.newKeyValue(e.value),
                ];
              }),
              (p.getCurrentAggregationType = function() {
                return u.a.find(l, {value: p.target.aggregationType});
              }),
              (p.onAggregationFieldChange = function() {
                (p.target.aggregationField = p.segmentAggregationTarget.value),
                  p.panelCtrl.refresh();
              }),
              (p.onAggregationTypeChange = function() {
                (p.target.aggregationRequiresTarget = p.getCurrentAggregationType().requiresTarget),
                  p._resetAggregation(),
                  p.panelCtrl.refresh();
              }),
              (p._resetAggregation = function() {
                delete p.target.aggregationAlias,
                  delete p.target.aggregationField,
                  p.removeGroupBy(),
                  (p.segmentAggregationTarget = p.uiSegmentSrv.newFake(
                    'select target attribute',
                    'value',
                    'query-segment-value'
                  ));
              }),
              (p.getTargetOptions = function() {
                var e = p.getAllDeepKeys(),
                  t = u.a.map(e, function(e) {
                    return p.uiSegmentSrv.newSegment({value: e});
                  });
                return p.$q.when(t);
              }),
              (p.getGroupByOptions = function() {
                var e = p.getAllDeepKeys(),
                  t = u.a.map(e, function(e) {
                    return p.uiSegmentSrv.newSegment({value: e});
                  });
                return p.$q.when(t);
              }),
              (p.onGroupByChange = function() {
                (p.target.groupBy = p.groupBySegment.value), p.panelCtrl.refresh();
              }),
              (p.removeGroupBy = function() {
                (p.groupBySegment = p.uiSegmentSrv.newPlusButton()),
                  delete p.target.groupBy,
                  delete p.target.groupAlias,
                  p.panelCtrl.refresh();
              }),
              (p.getNamespaceOptions = function() {
                return s
                  .query(p.datasource, {
                    method: 'GET',
                    url: '/namespaces',
                    namespaces: [],
                    limit: 0,
                    responseFilters: [],
                  })
                  .then(function(e) {
                    var t = u.a.map(e, function(e) {
                      return e.name;
                    });
                    return (
                      t.unshift('*'),
                      u.a.each(p.templateSrv.variables, function(e) {
                        return t.unshift('$' + e.name);
                      }),
                      u.a.map(t, function(e) {
                        return p.uiSegmentSrv.newSegment({value: e});
                      })
                    );
                  })
                  .catch(function() {
                    return [];
                  });
              }),
              (p.onNamespaceChange = function() {
                (p.target.namespace = p.namespaceSegment.value), p.panelCtrl.refresh();
              }),
              (p._reset = function() {
                (p.target.fieldSelectors = [new k(p, '*')]),
                  (p.clientFilterSegments = [[p.uiSegmentSrv.newPlusButton()]]),
                  (p.serverFilterSegments = [[p.uiSegmentSrv.newPlusButton()]]),
                  p._updateFilterTarget();
              }),
              (p.onApiChange = function() {
                p._reset(), p.panelCtrl.refresh();
              }),
              (p.onQueryTypeChange = function() {
                p._resetAggregation(), p.panelCtrl.refresh();
              }),
              (p.removeFilter = function(e, t) {
                (t ? p.serverFilterSegments : p.clientFilterSegments).splice(e, 1),
                  p._updateFilterTarget(),
                  p.panelCtrl.refresh();
              }),
              (p.onFilterSegmentUpdate = function(e, t, r) {
                if ('plus-button' !== e.type) {
                  if (2 == r) {
                    var n = e.value;
                    /\/.*\/\w*/.test(n) &&
                      (p.clientFilterSegments[t][1] = p.uiSegmentSrv.newOperator('=~'));
                  }
                  p._updateFilterTarget(), p.panelCtrl.refresh();
                } else p._addClientFilterSegment(e);
              }),
              (p._addClientFilterSegment = function(e) {
                var t = [
                  p.uiSegmentSrv.newKey(e.value),
                  p.uiSegmentSrv.newOperator('=='),
                  p.uiSegmentSrv.newFake(
                    'select filter value',
                    'value',
                    'query-segment-value'
                  ),
                ];
                p.clientFilterSegments.pop(),
                  p.clientFilterSegments.push(t),
                  p.clientFilterSegments.push([p.uiSegmentSrv.newPlusButton()]);
              }),
              (p._addServerFilterSegment = function(e) {
                var t = [
                  p.uiSegmentSrv.newCondition(e.value),
                  p.uiSegmentSrv.newFake(
                    'select filter key',
                    'value',
                    'query-segment-value'
                  ),
                  p.uiSegmentSrv.newOperator('=='),
                  p.uiSegmentSrv.newFake(
                    'select filter value',
                    'value',
                    'query-segment-value'
                  ),
                ];
                p.serverFilterSegments.pop(),
                  p.serverFilterSegments.push(t),
                  p.serverFilterSegments.push([p.uiSegmentSrv.newPlusButton()]);
              }),
              (p.onServerFilterSegmentUpdate = function(e) {
                'plus-button' !== e.type
                  ? (p._updateFilterTarget(), p.panelCtrl.refresh())
                  : p._addServerFilterSegment(e);
              }),
              (p.getFilterSegmentOptions = function(e, t, r) {
                var n = [];
                if ('operator' === e.type)
                  n = p.uiSegmentSrv.newOperators(['==', '=~', '!=', '!~', '<', '>']);
                else if (p.dataPreview && 0 < p.dataPreview.length) {
                  var a = [];
                  if (0 === r) a = p.getAllDeepKeys();
                  else if (2 === r) {
                    var i = p.clientFilterSegments[t][0].value;
                    (a = u()(p.dataPreview)
                      .map(function(e) {
                        return u.a.get(e, i);
                      })
                      .uniq()
                      .value()),
                      u.a.each(p.templateSrv.variables, function(e) {
                        return a.unshift('/$' + e.name + '/');
                      });
                  }
                  n = u.a.map(a, function(e) {
                    return p.uiSegmentSrv.newSegment(String(e));
                  });
                }
                return p.$q.when(n);
              }),
              (p._updateFilterTarget = function() {
                var e = p.target,
                  t = u()(p.clientFilterSegments)
                    .filter(function(e) {
                      return 3 === e.length;
                    })
                    .filter(function(e) {
                      return !e[2].fake;
                    })
                    .map(function(e) {
                      return {key: e[0].value, matcher: e[1].value, value: e[2].value};
                    })
                    .value();
                e.clientSideFilters = t;
                var r = u()(p.serverFilterSegments)
                  .filter(function(e) {
                    return 4 === e.length;
                  })
                  .filter(function(e) {
                    return !e[1].fake && !e[3].fake;
                  })
                  .map(function(e) {
                    var t;
                    switch (e[0].value) {
                      case 'fieldSelector':
                        t = n.FIELD;
                        break;
                      case 'labelSelector':
                        t = n.LABEL;
                        break;
                      default:
                        return {};
                    }
                    return {
                      key: e[1].value,
                      matcher: e[2].value,
                      value: e[3].value,
                      type: t,
                    };
                  })
                  .filter(function(e) {
                    return void 0 !== e.type;
                  })
                  .value();
                e.serverSideFilters = r;
              }),
              (p.getAllDeepKeys = function() {
                return u.a.flatMap(p.combineKeys(p.dataPreview[0]), function(e) {
                  return e;
                });
              }),
              (p.getFieldSelectorOptions = function(e, t, r) {
                var n = [];
                if (p.dataPreview && 0 < p.dataPreview.length) {
                  var a = [],
                    i = p.dataPreview[0];
                  if (0 < r)
                    for (var s = 0; s < r; s++) {
                      var l = p.target.fieldSelectors[t].fieldSegments[s];
                      i = u.a.get(i, l.value);
                    }
                  (a = u.a.concat(a, ['*'])),
                    (a = u.a.concat(a, Object.keys(i))).sort(),
                    (n = u.a.map(a, function(e) {
                      return p.uiSegmentSrv.newSegment({value: e});
                    }));
                }
                return p.$q.when(n);
              }),
              (p.onFieldSelectorSegmentUpdate = function(e, t) {
                e == p.addFieldSegment
                  ? (p.target.fieldSelectors.push(new k(p, e.value)),
                    (p.addFieldSegment = p.uiSegmentSrv.newPlusButton()))
                  : p.target.fieldSelectors[t].refresh(p),
                  p.panelCtrl.refresh();
              }),
              (p.removeField = function(e) {
                p.target.fieldSelectors.splice(e, 1), p.panelCtrl.refresh();
              }),
              (p.onAliasChange = function() {
                p.panelCtrl.refresh();
              }),
              (p.combineKeys = function(e) {
                var t = Object.keys(e);
                return u.a.flatMap(t, function(t) {
                  return u.a.isPlainObject(e[t])
                    ? u.a.map(p.combineKeys(e[t]), function(e) {
                        return t + '.' + e;
                      })
                    : t;
                });
              }),
              (p._getCurrentApi = function() {
                return u.a.find(o, {value: p.target.apiEndpoints});
              }),
              (p.getServerFilterOptions = function(e, t) {
                if ('operator' === e.type)
                  return p.$q.when(
                    p.uiSegmentSrv.newOperators(['==', '!=', 'in', 'notin', 'matches'])
                  );
                if ('plus-button' === e.type || 'condition' === e.type)
                  return p.$q.when(
                    u.a.map(['fieldSelector', 'labelSelector'], function(e) {
                      return p.uiSegmentSrv.newSegment({value: e});
                    })
                  );
                var r = u.a.map(p.templateSrv.variables, function(e) {
                  return '"$' + e.name + '"';
                });
                if ('fieldSelector' === p.serverFilterSegments[t][0].value) {
                  var n = p._getCurrentApi();
                  n &&
                    n.fieldSelectors.forEach(function(e) {
                      return r.push(e);
                    });
                }
                var a = u.a.map(r, function(e) {
                  return p.uiSegmentSrv.newSegment(new String(e));
                });
                return p.$q.when(a);
              }),
              (p.onDataReceived = function() {
                0 < p.dataPreviewBuffer.length &&
                  ((p.dataPreview = u.a.flatten(p.dataPreviewBuffer)),
                  (p.dataPreviewBuffer = []));
              }),
              (p.onResponseReceived = function(e) {
                e.config.url.endsWith('/auth') || p.dataPreviewBuffer.push(e.data);
              }),
              (p.onRefresh = function() {
                p.dataPreview = {};
              }),
              w(p.target);
            var v = p.target,
              m = v.clientSideFilters,
              d = v.serverSideFilters;
            return (
              u()(m)
                .map(p._createClientFilterSegments)
                .each(function(e) {
                  return p.clientFilterSegments.push(e);
                }),
              p.clientFilterSegments.push([p.uiSegmentSrv.newPlusButton()]),
              u()(d)
                .map(p._createServerFilterSegments)
                .each(function(e) {
                  return p.serverFilterSegments.push(e);
                }),
              p.serverFilterSegments.push([p.uiSegmentSrv.newPlusButton()]),
              void 0 === p.target.fieldSelectors
                ? (p.target.fieldSelectors = [new k(p, '*')])
                : (p.target.fieldSelectors = u.a.map(p.target.fieldSelectors, function(
                    e
                  ) {
                    return k.restore(p, e);
                  })),
              void 0 === p.target.apiEndpoints && (p.target.apiEndpoints = o[0].value),
              void 0 === p.target.queryType &&
                (p.target.queryType = p.queryTypes[0].value),
              void 0 === p.target.format && (p.target.format = p.formats[0].value),
              (p.addFieldSegment = p.uiSegmentSrv.newPlusButton()),
              void 0 !== p.target.aggregation && delete p.target.aggregation,
              void 0 === p.target.aggregationType &&
                (p.target.aggregationType = l[0].value),
              void 0 === p.target.aggregationRequiresTarget &&
                (p.target.aggregationRequiresTarget = l[0].requiresTarget),
              void 0 === p.target.aggregationField
                ? (p.segmentAggregationTarget = p.uiSegmentSrv.newFake(
                    'select target attribute',
                    'value',
                    'query-segment-value'
                  ))
                : (p.segmentAggregationTarget = p.uiSegmentSrv.newSegment({
                    value: p.target.aggregationField,
                  })),
              void 0 === p.target.groupBy
                ? (p.groupBySegment = p.uiSegmentSrv.newPlusButton())
                : (p.groupBySegment = p.uiSegmentSrv.newSegment({
                    value: p.target.groupBy,
                  })),
              void 0 === p.target.namespace && (p.target.namespace = 'default'),
              (p.namespaceSegment = p.uiSegmentSrv.newSegment({
                value: p.target.namespace,
              })),
              b.a.on('ds-request-response', p.onResponseReceived, t),
              p.panelCtrl.events.on('refresh', p.onRefresh, t),
              p.panelCtrl.events.on('data-received', p.onDataReceived, t),
              p.panelCtrl.refresh(),
              p
            );
          }
          return (
            E(t, e),
            (t.$inject = ['$scope', '$injector', '$q', 'uiSegmentSrv', 'templateSrv']),
            (t.prototype.getCollapsedText = function() {
              return (function(e) {
                var t = 'QUERY API ' + e.apiEndpoints;
                return (
                  (t += (function(e) {
                    return 'default' === e.namespace
                      ? ''
                      : ' IN NAMESPACE ' + e.namespace;
                  })(e)),
                  'field' === e.queryType
                    ? (t += (function(e) {
                        return (
                          ' SELECT ' +
                          u()(e.fieldSelectors)
                            .flatMap(function(e) {
                              return e.alias
                                ? e.getPath() + ' AS ' + e.alias
                                : e.getPath();
                            })
                            .join(', ')
                        );
                      })(e))
                    : 'aggregation' === e.queryType &&
                      (t += (function(e) {
                        var t = ' AGGREGATE ' + e.aggregationType;
                        return (
                          e.aggregationRequiresTarget &&
                            (t += ' ON ' + e.aggregationField),
                          t
                        );
                      })(e)),
                  (t += (function(e) {
                    var t = e.clientSideFilters,
                      r = e.serverSideFilters,
                      a = u()(r)
                        .map(function(e) {
                          return (
                            (e.type == n.FIELD ? 'fieldSelector' : 'labelSelector') +
                            ':' +
                            e.key +
                            ' ' +
                            e.matcher.toUpperCase() +
                            ' ' +
                            e.value
                          );
                        })
                        .value(),
                      i = u()(t)
                        .map(function(e) {
                          return e.key + ' ' + e.matcher + ' ' + e.value;
                        })
                        .value(),
                      s = u()([a, i])
                        .flatten()
                        .join(' AND ');
                    return s ? ' WHERE ' + s : '';
                  })(e)) +
                    (function(e) {
                      var t;
                      return 0 <
                        (t = e.limit
                          ? u.a.defaultTo(parseInt(e.limit), 100)
                          : 'aggregation' === e.queryType ? 0 : 100)
                        ? ' LIMIT ' + t
                        : '';
                    })(e)
                );
              })(this.target);
            }),
            (t.templateUrl = 'partials/query.editor.html'),
            t
          );
        })(P.QueryCtrl),
        C = (function() {
          function e(e) {
            var t = this;
            (this.onUseApiKeyToggle = function() {
              var e = t.current;
              e.jsonData.useApiKey && ((e.basicAuth = !1), t.resetApiKey());
            }),
              (this.resetApiKey = function() {
                (t.current.secureJsonFields.apiKey = !1),
                  (t.current.secureJsonData = t.current.secureJsonData || {}),
                  (t.current.secureJsonData.apiKey = '');
              }),
              e.$watch(
                function() {
                  return t.current.url;
                },
                function(e) {
                  return (t.current.jsonData.currentUrl = e);
                }
              ),
              e.$watch(
                function() {
                  return t.current.basicAuth;
                },
                function(e) {
                  e && (t.current.jsonData.useApiKey = !1);
                }
              );
          }
          return (e.$inject = ['$scope']), (e.templateUrl = 'partials/config.html'), e;
        })();
    },
  ]);
});
//# sourceMappingURL=module.js.map
