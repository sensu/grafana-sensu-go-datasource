define(['lodash', 'moment', 'app/core/app_events', 'app/plugins/sdk'], function(
  e,
  t,
  r,
  n
) {
  return (
    (u = {}),
    (a.m = i = [
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
            return _;
          }),
          r.d(t, 'QueryCtrl', function() {
            return P;
          }),
          r.d(t, 'ConfigCtrl', function() {
            return k;
          });
        t = r(0);
        var n,
          a = r.n(t);
        function i() {}
        ((t = n = n || {})[(t.FIELD = 0)] = 'FIELD'), (t[(t.LABEL = 1)] = 'LABEL');
        var u = ((i.query = function(e, t) {
            var r = this,
              n = t.namespaces;
            return (
              a.a.isEmpty(n) && '/namespaces' === t.url && n.push(''),
              (n = a.a.map(n, function(n) {
                return r._doQuery(e, t, n);
              })),
              Promise.all(n).then(function(e) {
                return a.a.flatten(e);
              })
            );
          }),
          (i._doQuery = function(e, t, r, n) {
            var a = this;
            void 0 === n && (n = 0);
            var u,
              s = t.method,
              l = t.url;
            u =
              '/namespaces' === l
                ? i.apiBaseUrl + '/namespaces'
                : i.apiBaseUrl + ('*' === r ? '' : '/namespaces/' + r) + l;
            var o = this._getParameters(t);
            return i
              ._authenticate(e)
              .then(function() {
                return i._request(e, s, u, o);
              })
              .then(function(e) {
                return e.data;
              })
              .catch(function(i) {
                if (1 <= n) throw i;
                delete e.instanceSettings.tokens;
                var u = Math.floor(1e3 + 1e3 * Math.random());
                return new Promise(function(e) {
                  return setTimeout(e, u);
                }).then(function() {
                  return a._doQuery(e, t, r, n + 1);
                });
              });
          }),
          (i._authenticate = function(e) {
            var t = e.instanceSettings.tokens;
            return a.a.get(e.instanceSettings, 'jsonData.useApiKey', !1) ||
              (t && !i._isTokenExpired(t))
              ? Promise.resolve(!0)
              : i._acquireAccessToken(e);
          }),
          (i._isTokenExpired = function(e) {
            var t = Math.floor(Date.now() / 1e3),
              r = e.expires_at;
            return (
              (r = e.expires_offset ? r - e.expires_offset - i.tokenExpireOffset_s : r) <
              t
            );
          }),
          (i._acquireAccessToken = function(e) {
            return i._request(e, 'GET', '/auth').then(function(t) {
              var r = t.data;
              (t = Math.floor(Date.now() / 1e3)),
                (t = r.expires_at - t - i.tokenTimeout_s);
              (r.expires_offset = t), (e.instanceSettings.tokens = r);
            });
          }),
          (i._request = function(e, t, r, n) {
            return (
              void 0 === n && (n = {}),
              (t = {method: t, headers: {'Content-Type': 'application/json'}}),
              a.a.get(e.instanceSettings, 'jsonData.useApiKey', !1)
                ? (t.url = e.url + i.apiKeyUrlPrefix + r)
                : ((t.url = e.url + r),
                  a.a.has(e.instanceSettings, 'tokens') &&
                    (t.headers.Authorization =
                      'Bearer ' + e.instanceSettings.tokens.access_token)),
              (t.params = n),
              e.backendSrv
                .datasourceRequest(t)
                .then(i._handleRequestResult, i._handleRequestError)
            );
          }),
          (i._handleRequestResult = function(e) {
            if (e) return e;
            throw {
              message: 'Credentials Invalid: Could not logged in using credentials',
              data: 'access_error',
            };
          }),
          (i._handleRequestError = function(e) {
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
          (i._getParameters = function(e) {
            var t = e.limit,
              r = e.responseFilters,
              a = {};
            return (
              '' !==
                (e = this._buildFilterParameter(
                  r.filter(function(e) {
                    return e.type === n.FIELD;
                  })
                )) && (a.fieldSelector = e),
              '' !==
                (r = this._buildFilterParameter(
                  r.filter(function(e) {
                    return e.type === n.LABEL;
                  })
                )) && (a.labelSelector = r),
              0 < t && (a.limit = t),
              a
            );
          }),
          (i._buildFilterParameter = function(e) {
            var t = this;
            return a()(e)
              .map(function(e) {
                return e.key + ' ' + e.matcher + ' ' + t._parseGrafanaMultiValue(e.value);
              })
              .join(' && ');
          }),
          (i._parseGrafanaMultiValue = function(e) {
            if (this.grafanaMultiValueRegex.test(e)) {
              var t = e;
              return (
                this.grafanaMultiValueReplaceTouples.forEach(function(e) {
                  t = a.a.replace(t, e.pattern, e.replacement);
                }),
                t
              );
            }
            return e;
          }),
          (i.tokenTimeout_s = 600),
          (i.tokenExpireOffset_s = 60),
          (i.apiBaseUrl = '/api/core/v2'),
          (i.apiKeyUrlPrefix = '/api_key_auth'),
          (i.grafanaMultiValueRegex = new RegExp('[(].*[|].*[)]')),
          (i.grafanaMultiValueReplaceTouples = [
            {pattern: /[|]/g, replacement: ','},
            {pattern: /[)]/g, replacement: ']'},
            {pattern: /[(]/g, replacement: '['},
          ]),
          i),
          s = [
            {value: 'count', text: 'Count', requiresTarget: !1},
            {value: 'sum', text: 'Sum', requiresTarget: !0},
          ],
          l = [
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
          o = [
            {value: 'field', text: 'Field Selection'},
            {value: 'aggregation', text: 'Aggregation'},
          ],
          c = [
            {value: 'table', text: 'Table'},
            {value: 'table-v', text: 'Table (Vertical)'},
            {value: 'series', text: 'Time Series'},
          ],
          g = [
            'timestamp',
            'check.executed',
            'check.issued',
            'check.last_ok',
            'entity.last_seen',
            'last_seen',
          ],
          f = function(e, t, r) {
            if ('==' === t) return e == r;
            if ('!=' === t) return e != r;
            if ('=~' === t || '!~' === t)
              return (function(e, t, r) {
                var n = (function(e) {
                  var t = e.match(/\/(.*)\/(\w*)/);
                  return t ? new RegExp(t[1], t[2]) : new RegExp(e);
                })(e);
                return '=~' === t ? n.test(r) : !n.test(r);
              })(e, t, r);
            if ('<' === t || '>' === t)
              return (function(e, t, r) {
                var n = Number(e);
                return a.a.isFinite(n)
                  ? '<' === t ? r < n : r > n
                  : (console.warn(
                      'The specified filter value (' +
                        e +
                        ') is not compatible to filter on a numeric attribute.'
                    ),
                    !1);
              })(e, t, r);
            throw 'Unsupported operator "' + t + '"';
          },
          p =
            '(fieldSelector|labelSelector):(' +
            (t = '\\[[^[]+\\]|"[^"]+"|\\S+') +
            ')\\s*(==|!=|IN|NOTIN|MATCHES)\\s*(' +
            t +
            ')';
        t = r(1);
        var v = r.n(t),
          m = function(e, t) {
            var r,
              n,
              i = ((r = e),
              (n = {}),
              a()(r)
                .flatten()
                .map(function(e) {
                  var t = e.name;
                  e = e.value;
                  return a.a.isArray(e)
                    ? ((n[t] = !0),
                      a.a.times(e.length, function(e) {
                        return t + '[' + e + ']';
                      }))
                    : a.a.isNil(e) && a.a.get(n, t, !1) ? [] : [t];
                })
                .flatten()
                .uniq()
                .map(function(e) {
                  return {text: e};
                })
                .value()),
              u = {};
            a.a.each(i, function(e, t) {
              return (u[e.text] = t);
            });
            var s;
            e = a.a.map(e, function(e) {
              var t = a.a.times(i.length, a.a.constant(null));
              return (
                a()(e)
                  .map(function(e) {
                    var t = e.name;
                    e = e.value;
                    return a.a.isArray(e)
                      ? a.a.map(e, function(e, r) {
                          return [t + '[' + r + ']', e];
                        })
                      : [[t, e]];
                  })
                  .flatten()
                  .map(function(e) {
                    return (
                      (a.a.isPlainObject(e[1]) || a.a.isArray(e[1])) &&
                        (e[1] = JSON.stringify(e[1])),
                      e
                    );
                  })
                  .each(function(e) {
                    var r = e[0];
                    e = e[1];
                    t[u[r]] = e;
                  }),
                t
              );
            });
            return t
              ? ((s = i),
                (t = e),
                (function(e) {
                  a.a.each(e, function(e) {
                    for (var t = e[0], r = e[1], n = 0; n < g.length; n++)
                      if (t === g[n]) {
                        var i = a.a.defaultTo(r, -1);
                        0 < i && (e[1] = v()(i).format('YYYY-MM-DD HH:mm:ss'));
                        break;
                      }
                  });
                })(
                  (t = a()(t)
                    .flatten()
                    .map(function(e, t) {
                      return [s[t].text, e];
                    })
                    .value())
                ),
                {columns: [{text: 'Attribute'}, {text: 'Value'}], rows: t, type: 'table'})
              : {columns: i, rows: e, type: 'table'};
          },
          d = function(e, t) {
            return m(e, t);
          },
          S = function(e) {
            return (function(e) {
              var t = Date.now();
              return a()(e)
                .flatten()
                .filter(function(e) {
                  return a.a.isFinite(e.value);
                })
                .map(function(e) {
                  return {target: e.name, datapoints: [[e.value, t]]};
                })
                .value();
            })(e);
          },
          h = function(e) {
            var t,
              r = e.version;
            return (
              void 0 === r &&
                (((t = e).version = 2),
                (t.clientSideFilters = []),
                (t.serverSideFilters = [])),
              1 === r &&
                (function(e) {
                  console.log('Migrating data source configuration to version 2.');
                  var t = e.filterSegments,
                    r = a()(t)
                      .filter(function(e) {
                        return 3 === e.length;
                      })
                      .filter(function(e) {
                        return !a.a.get(e[2], 'fake', !1);
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
          };
        function y(e, t, r) {
          var i = this;
          (this.instanceSettings = e),
            (this.backendSrv = t),
            (this.templateSrv = r),
            (this.prepareQuery = function(e, t) {
              return (
                (e = {
                  apiUrl: i._getApiUrl(e),
                  clientFilters: a.a.cloneDeep(e.clientSideFilters),
                  serverFilters: a.a.cloneDeep(e.serverSideFilters),
                  target: a.a.cloneDeep(e),
                }),
                i._resolveTemplateVariables(e, t),
                e
              );
            }),
            (this._resolveTemplateVariables = function(e, t) {
              var r = e.target,
                n = e.clientFilters,
                a = e.serverFilters;
              e = i.templateSrv.replace(r.namespace, t.scopedVars, 'pipe').split('|');
              (r.namespaces = e),
                [n, a].forEach(function(e) {
                  return e.forEach(function(e) {
                    (e.key = i.templateSrv.replace(e.key, t.scopedVars, 'csv')),
                      (e.value = i.templateSrv.replace(e.value, t.scopedVars, 'regex'));
                  });
                });
            }),
            (this._getApiUrl = function(e) {
              return ((e = a.a.find(l, {value: e.apiEndpoints})) || l[0]).url;
            }),
            (this._timeCorrection = function(e) {
              return (
                a.a.each(e, function(e) {
                  a.a.each(g, function(t) {
                    var r = a.a.get(e, t, -1);
                    0 < r ? a.a.set(e, t, 1e3 * r) : a.a.unset(e, t);
                  });
                }),
                e
              );
            }),
            (this._queryGroupAndAggregate = function(e, t) {
              var r,
                n = (r = t.target).aggregationAlias,
                u = r.aggregationType,
                s = r.format;
              n = n || u || 'value';
              return (r = r.groupBy)
                ? ((u = a.a.groupBy(e, r)),
                  (u = a()(u)
                    .map(function(e, r) {
                      return i._queryAggregation(e, r, t);
                    })
                    .value()),
                  ('table' !== s && 'table-v' !== s) || !u
                    ? u
                    : ((s = t.target.groupAlias), i._mergeTableAggregation(u, s || r, n)))
                : [i._queryAggregation(e, n, t)];
            }),
            (this._mergeTableAggregation = function(e, t, r) {
              return a()(e)
                .map(function(e) {
                  return e && 0 != e.length
                    ? ((e = e[0]), [{name: t, value: e.name}, {name: r, value: e.value}])
                    : null;
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
                return r
                  ? ((r = a.a.sumBy(e, r)),
                    [{name: t, value: (r = a.a.isFinite(r) ? r : null)}])
                  : [];
              })(e, t, (r = r.target.aggregationField));
            }),
            (this._queryFieldSelection = function(e, t) {
              var r = i._extractColumnMappings(e, t);
              return a.a.map(e, function(e) {
                return a.a.map(r, function(t) {
                  var r = a.a.get(e, t.path);
                  return {name: t.alias, value: r};
                });
              });
            }),
            (this._extractColumnMappings = function(e, t) {
              return a.a.flatMap(t, function(t) {
                var r = a()(e)
                  .map(function(e) {
                    return i.resolvePaths(t, e);
                  })
                  .flatMap()
                  .uniq()
                  .value();
                return t.alias
                  ? 1 < r.length
                    ? a.a.map(r, function(e, r) {
                        return {path: e, alias: t.alias + '.' + r};
                      })
                    : a.a.map(r, function(e) {
                        return {path: e, alias: t.alias};
                      })
                  : a.a.map(r, function(e) {
                      return {path: e, alias: e};
                    });
              });
            }),
            (this._filterData = function(e, t) {
              return a.a.filter(e, function(e) {
                return a.a.every(t, function(t) {
                  return i._matches(e, t);
                });
              });
            }),
            (this._matches = function(e, t) {
              var r = t.key,
                n = t.matcher;
              (t = t.value), (r = a.a.get(e, r));
              return f(t, n, r);
            }),
            (this.resolvePaths = function(e, t) {
              for (var r = t, n = '', u = '', s = 0; s < e.fieldSegments.length; s++)
                '*' !== (n = e.fieldSegments[s].value) &&
                  ((u = '' === u ? n : u + '.' + n), (r = a.a.get(r, n)));
              return '*' !== n
                ? [u]
                : ((t = i._deepResolve(r)),
                  '' === u
                    ? t
                    : a.a.map(t, function(e) {
                        return u + '.' + e;
                      }));
            }),
            (this._deepResolve = function(e) {
              var t = Object.keys(e);
              return a.a.flatMap(t, function(t) {
                return a.a.isPlainObject(e[t])
                  ? a.a.map(i._deepResolve(e[t]), function(e) {
                      return t + '.' + e;
                    })
                  : t;
              });
            }),
            (this._query = function(e) {
              return null ===
                (e = (function(e) {
                  var t = new RegExp(
                    '^\\s*QUERY\\s+API\\s+(entity|events|namespaces)\\s+(IN\\s+NAMESPACE\\s+(\\S+)\\s+)?SELECT\\s+(\\S+)(\\s+WHERE\\s+(((fieldSelector|labelSelector):(\\[[^[]+\\]|"[^"]+"|\\S+)\\s*(==|!=|IN|NOTIN|MATCHES)\\s*(\\[[^[]+\\]|"[^"]+"|\\S+)|([^\\s:=!]+)\\s*(==|=~|!=|>|<|!~|=)\\s*(\\S+))(\\s+AND\\s+((fieldSelector|labelSelector):(\\[[^[]+\\]|"[^"]+"|\\S+)\\s*(==|!=|IN|NOTIN|MATCHES)\\s*(\\[[^[]+\\]|"[^"]+"|\\S+)|([^\\s:=!]+)\\s*(==|=~|!=|>|<|!~|=)\\s*(\\S+)))*))?(\\s+LIMIT\\s+(\\d+))?\\s*$',
                    'i'
                  );
                  if (!(e = e.match(t))) return null;
                  t = void 0 !== e[3] ? e[3] : 'default';
                  var r = {
                    apiKey: e[1],
                    namespace: t,
                    selectedField: e[4],
                    clientFilters: [],
                    serverFilters: [],
                    limit: parseInt(e[25]),
                  };
                  if (void 0 !== e[6])
                    for (
                      var a,
                        i,
                        u = new RegExp(
                          p + '|([^\\s:=!]+)\\s*(==|=~|!=|>|<|!~|=)\\s*(\\S+)',
                          'gi'
                        ),
                        s = e[6];
                      null !== (a = u.exec(s));

                    )
                      void 0 !== a[1]
                        ? ((i = {
                            type: 'fieldSelector' === a[1] ? n.FIELD : n.LABEL,
                            key: a[2],
                            matcher: a[3],
                            value: a[4],
                          }),
                          r.serverFilters.push(i))
                        : ((i = {
                            key: a[5],
                            matcher: '=' === a[6] ? '==' : a[6],
                            value: a[7],
                          }),
                          r.clientFilters.push(i));
                  return r;
                })(e))
                ? Promise.resolve([])
                : (((e = i._transformQueryComponentsToQueryOptions(
                    e
                  )).resultAsPlainArray = !0),
                  i.query(e));
            }),
            (this._transformQueryComponentsToQueryOptions = function(e) {
              var t = e.apiKey,
                r = e.selectedField,
                n = e.clientFilters,
                i = e.serverFilters,
                u = e.namespace;
              e = e.limit;
              return {
                targets: [
                  {
                    apiEndpoints: t,
                    queryType: 'field',
                    namespace: u,
                    limit: a.a.isNaN(e) ? null : new String(e),
                    fieldSelectors: [{fieldSegments: [{value: r}]}],
                    format: 'table',
                    clientSideFilters: n,
                    serverSideFilters: i,
                    version: 2,
                  },
                ],
              };
            }),
            (this.url = e.url.trim());
        }
        var _ = ((y.$inject = ['instanceSettings', 'backendSrv', 'templateSrv']),
          (y.prototype.query = function(e) {
            var t = this,
              r = a()(e.targets)
                .filter(function(e) {
                  return !e.hide;
                })
                .map(h)
                .map(function(r) {
                  return t.prepareQuery(r, e);
                })
                .value();
            if (0 === r.length) return Promise.resolve({data: []});
            var n = r.map(function(e) {
              var r = e.apiUrl,
                n = e.clientFilters,
                i = e.serverFilters,
                s = (c = e.target).queryType,
                l = c.fieldSelectors,
                o = c.namespaces,
                c = c.limit;
              c = a.a.defaultTo(parseInt(c || ''), -1);
              return u
                .query(t, {
                  method: 'GET',
                  url: r,
                  namespaces: o,
                  limit: (c = c < 0 ? ('aggregation' === s ? 0 : 100) : c),
                  responseFilters: i,
                })
                .then(t._timeCorrection)
                .then(function(e) {
                  return t._filterData(e, n);
                })
                .then(function(r) {
                  return 'field' === s
                    ? t._queryFieldSelection(r, l)
                    : 'aggregation' === s ? t._queryGroupAndAggregate(r, e) : [];
                });
            });
            return Promise.all(n).then(function(t) {
              return e.resultAsPlainArray
                ? a()(t)
                    .map(function(e) {
                      return d(e, !1);
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
                    data: a.a.flatMap(t, function(e, t) {
                      return 'series' === (t = r[t].target.format)
                        ? S(e)
                        : d(e, 'table-v' === t);
                    }),
                  };
            });
          }),
          (y.prototype.metricFindQuery = function(e) {
            return this._query(e);
          }),
          (y.prototype.testDatasource = function() {
            var e = a.a.get(this.instanceSettings, 'jsonData.useApiKey', !1);
            return u
              ._request(this, 'GET', e ? '/api/core/v2/namespaces' : '/auth/test')
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
          y),
          F = ((t = r(2)), r.n(t));
        t = r(3);
        function w(e, t) {
          var r = this;
          (this.refresh = function(e) {
            if (e.dataPreview && !(e.dataPreview.length <= 0)) {
              for (var t = e.dataPreview[0], n = 0; n < r.fieldSegments.length; n++) {
                var i = r.fieldSegments[n].value;
                t = t && a.a.get(t, i);
                '*' === i && (r.fieldSegments = r.fieldSegments.slice(0, n + 1));
              }
              void 0 === t
                ? (r.fieldType = 'undefined')
                : a.a.isPlainObject(t)
                  ? (r.fieldSegments.push(e.uiSegmentSrv.newKey('*')),
                    (r.fieldType = 'object'))
                  : a.a.isArray(t)
                    ? (r.fieldType = 'array')
                    : (r.fieldType = 'number' == typeof t ? 'number' : 'string'),
                (r.attributePath = r.getPath());
            }
          }),
            (this.getPath = function() {
              return a()(r.fieldSegments)
                .map(function(e) {
                  return e.value;
                })
                .join('.');
            }),
            (this.fieldSegments = a.a.map(t.split('.'), function(t) {
              return e.uiSegmentSrv.newKey(t);
            })),
            this.refresh(e);
        }
        var T,
          A,
          b = ((w.restore = function(e, t) {
            return (
              ((e = new w(
                e,
                a()(t.fieldSegments)
                  .map(function(e) {
                    return e.value;
                  })
                  .join('.')
              )).alias =
                t.alias),
              e
            );
          }),
          w),
          P = ((r = ((T = function(e, t) {
            return (T =
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
            if ('function' != typeof t && null !== t)
              throw new TypeError(
                'Class extends value ' + String(t) + ' is not a constructor or null'
              );
            function r() {
              this.constructor = e;
            }
            T(e, t),
              (e.prototype =
                null === t ? Object.create(t) : ((r.prototype = t.prototype), new r()));
          }))(E, (A = t.QueryCtrl)),
          (E.$inject = ['$scope', '$injector', '$q', 'uiSegmentSrv', 'templateSrv']),
          (E.prototype.getCollapsedText = function() {
            return (function(e) {
              var t,
                r = 'QUERY API ' + e.apiEndpoints;
              return (
                (r += (function(e) {
                  return 'default' === e.namespace ? '' : ' IN NAMESPACE ' + e.namespace;
                })(e)),
                'field' === e.queryType
                  ? (r += ((t = e),
                    ' SELECT ' +
                      a()(t.fieldSelectors)
                        .flatMap(function(e) {
                          return e.alias ? e.getPath() + ' AS ' + e.alias : e.getPath();
                        })
                        .join(', ')))
                  : 'aggregation' === e.queryType &&
                    (r += (function(e) {
                      var t = ' AGGREGATE ' + e.aggregationType;
                      return (
                        e.aggregationRequiresTarget && (t += ' ON ' + e.aggregationField),
                        t
                      );
                    })(e)),
                (r += (function(e) {
                  var t = e.clientSideFilters,
                    r = e.serverSideFilters,
                    i = a()(r)
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
                    u = a()(t)
                      .map(function(e) {
                        return e.key + ' ' + e.matcher + ' ' + e.value;
                      })
                      .value(),
                    s = a()([i, u])
                      .flatten()
                      .join(' AND ');
                  return s ? ' WHERE ' + s : '';
                })(e)) +
                  (function(e) {
                    var t;
                    return (t = e.limit
                      ? a.a.defaultTo(parseInt(e.limit), 100)
                      : 'aggregation' === e.queryType ? 0 : 100) > 0
                      ? ' LIMIT ' + t
                      : '';
                  })(e)
              );
            })(this.target);
          }),
          (E.templateUrl = 'partials/query.editor.html'),
          E);
        function E(e, t, r, i, g) {
          var f = A.call(this, e, t) || this;
          return (
            (f.$q = r),
            (f.uiSegmentSrv = i),
            (f.templateSrv = g),
            (f.aggregationTypes = s),
            (f.queryTypes = o),
            (f.formats = c),
            (f.dataPreview = {}),
            (f.dataPreviewBuffer = []),
            (f.apiEndpoints = l),
            (f.clientFilterSegments = []),
            (f.serverFilterSegments = []),
            (f._createClientFilterSegments = function(e) {
              return [
                f.uiSegmentSrv.newKey(e.key),
                f.uiSegmentSrv.newOperator(e.matcher),
                f.uiSegmentSrv.newKeyValue(e.value),
              ];
            }),
            (f._createServerFilterSegments = function(e) {
              var t = e.type === n.FIELD ? 'fieldSelector' : 'labelSelector';
              return [
                f.uiSegmentSrv.newCondition(t),
                f.uiSegmentSrv.newKey(e.key),
                f.uiSegmentSrv.newOperator(e.matcher),
                f.uiSegmentSrv.newKeyValue(e.value),
              ];
            }),
            (f.getCurrentAggregationType = function() {
              return a.a.find(s, {value: f.target.aggregationType});
            }),
            (f.onAggregationFieldChange = function() {
              (f.target.aggregationField = f.segmentAggregationTarget.value),
                f.panelCtrl.refresh();
            }),
            (f.onAggregationTypeChange = function() {
              (f.target.aggregationRequiresTarget = f.getCurrentAggregationType().requiresTarget),
                f._resetAggregation(),
                f.panelCtrl.refresh();
            }),
            (f._resetAggregation = function() {
              delete f.target.aggregationAlias,
                delete f.target.aggregationField,
                f.removeGroupBy(),
                (f.segmentAggregationTarget = f.uiSegmentSrv.newFake(
                  'select target attribute',
                  'value',
                  'query-segment-value'
                ));
            }),
            (f.getTargetOptions = function() {
              var e = f.getAllDeepKeys();
              e = a.a.map(e, function(e) {
                return f.uiSegmentSrv.newSegment({value: e});
              });
              return f.$q.when(e);
            }),
            (f.getGroupByOptions = function() {
              var e = f.getAllDeepKeys();
              e = a.a.map(e, function(e) {
                return f.uiSegmentSrv.newSegment({value: e});
              });
              return f.$q.when(e);
            }),
            (f.onGroupByChange = function() {
              (f.target.groupBy = f.groupBySegment.value), f.panelCtrl.refresh();
            }),
            (f.removeGroupBy = function() {
              (f.groupBySegment = f.uiSegmentSrv.newPlusButton()),
                delete f.target.groupBy,
                delete f.target.groupAlias,
                f.panelCtrl.refresh();
            }),
            (f.getNamespaceOptions = function() {
              return u
                .query(f.datasource, {
                  method: 'GET',
                  url: '/namespaces',
                  namespaces: [],
                  limit: 0,
                  responseFilters: [],
                })
                .then(function(e) {
                  var t = a.a.map(e, function(e) {
                    return e.name;
                  });
                  return (
                    t.unshift('*'),
                    a.a.each(f.templateSrv.variables, function(e) {
                      return t.unshift('$' + e.name);
                    }),
                    a.a.map(t, function(e) {
                      return f.uiSegmentSrv.newSegment({value: e});
                    })
                  );
                })
                .catch(function() {
                  return [];
                });
            }),
            (f.onNamespaceChange = function() {
              (f.target.namespace = f.namespaceSegment.value), f.panelCtrl.refresh();
            }),
            (f._reset = function() {
              (f.target.fieldSelectors = [new b(f, '*')]),
                (f.clientFilterSegments = [[f.uiSegmentSrv.newPlusButton()]]),
                (f.serverFilterSegments = [[f.uiSegmentSrv.newPlusButton()]]),
                f._updateFilterTarget();
            }),
            (f.onApiChange = function() {
              f._reset(), f.panelCtrl.refresh();
            }),
            (f.onQueryTypeChange = function() {
              f._resetAggregation(), f.panelCtrl.refresh();
            }),
            (f.removeFilter = function(e, t) {
              (t ? f.serverFilterSegments : f.clientFilterSegments).splice(e, 1),
                f._updateFilterTarget(),
                f.panelCtrl.refresh();
            }),
            (f.onFilterSegmentUpdate = function(e, t, r) {
              'plus-button' !== e.type
                ? (2 == r &&
                    ((r = e.value),
                    /\/.*\/\w*/.test(r) &&
                      (f.clientFilterSegments[t][1] = f.uiSegmentSrv.newOperator('=~'))),
                  f._updateFilterTarget(),
                  f.panelCtrl.refresh())
                : f._addClientFilterSegment(e);
            }),
            (f._addClientFilterSegment = function(e) {
              (e = [
                f.uiSegmentSrv.newKey(e.value),
                f.uiSegmentSrv.newOperator('=='),
                f.uiSegmentSrv.newFake(
                  'select filter value',
                  'value',
                  'query-segment-value'
                ),
              ]),
                f.clientFilterSegments.pop(),
                f.clientFilterSegments.push(e),
                f.clientFilterSegments.push([f.uiSegmentSrv.newPlusButton()]);
            }),
            (f._addServerFilterSegment = function(e) {
              (e = [
                f.uiSegmentSrv.newCondition(e.value),
                f.uiSegmentSrv.newFake(
                  'select filter key',
                  'value',
                  'query-segment-value'
                ),
                f.uiSegmentSrv.newOperator('=='),
                f.uiSegmentSrv.newFake(
                  'select filter value',
                  'value',
                  'query-segment-value'
                ),
              ]),
                f.serverFilterSegments.pop(),
                f.serverFilterSegments.push(e),
                f.serverFilterSegments.push([f.uiSegmentSrv.newPlusButton()]);
            }),
            (f.onServerFilterSegmentUpdate = function(e) {
              'plus-button' !== e.type
                ? (f._updateFilterTarget(), f.panelCtrl.refresh())
                : f._addServerFilterSegment(e);
            }),
            (f.getFilterSegmentOptions = function(e, t, r) {
              var n,
                i,
                u = [];
              return (
                'operator' === e.type
                  ? (u = f.uiSegmentSrv.newOperators(['==', '=~', '!=', '!~', '<', '>']))
                  : f.dataPreview &&
                    0 < f.dataPreview.length &&
                    ((i = []),
                    0 === r
                      ? (i = f.getAllDeepKeys())
                      : 2 === r &&
                        ((n = f.clientFilterSegments[t][0].value),
                        (i = a()(f.dataPreview)
                          .map(function(e) {
                            return a.a.get(e, n);
                          })
                          .uniq()
                          .value()),
                        a.a.each(f.templateSrv.variables, function(e) {
                          return i.unshift('/$' + e.name + '/');
                        })),
                    (u = a.a.map(i, function(e) {
                      return f.uiSegmentSrv.newSegment(String(e));
                    }))),
                f.$q.when(u)
              );
            }),
            (f._updateFilterTarget = function() {
              var e = f.target,
                t = a()(f.clientFilterSegments)
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
              (e.clientSideFilters = t),
                (t = a()(f.serverFilterSegments)
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
                  .value()),
                (e.serverSideFilters = t);
            }),
            (f.getAllDeepKeys = function() {
              return a.a.flatMap(f.combineKeys(f.dataPreview[0]), function(e) {
                return e;
              });
            }),
            (f.getFieldSelectorOptions = function(e, t, r) {
              var n = [];
              if (f.dataPreview && 0 < f.dataPreview.length) {
                var i = [],
                  u = f.dataPreview[0];
                if (0 < r)
                  for (var s = 0; s < r; s++) {
                    var l = f.target.fieldSelectors[t].fieldSegments[s];
                    u = a.a.get(u, l.value);
                  }
                (i = a.a.concat(i, ['*'])),
                  (i = a.a.concat(i, Object.keys(u))).sort(),
                  (n = a.a.map(i, function(e) {
                    return f.uiSegmentSrv.newSegment({value: e});
                  }));
              }
              return f.$q.when(n);
            }),
            (f.onFieldSelectorSegmentUpdate = function(e, t) {
              e == f.addFieldSegment
                ? (f.target.fieldSelectors.push(new b(f, e.value)),
                  (f.addFieldSegment = f.uiSegmentSrv.newPlusButton()))
                : f.target.fieldSelectors[t].refresh(f),
                f.panelCtrl.refresh();
            }),
            (f.removeField = function(e) {
              f.target.fieldSelectors.splice(e, 1), f.panelCtrl.refresh();
            }),
            (f.onAliasChange = function() {
              f.panelCtrl.refresh();
            }),
            (f.combineKeys = function(e) {
              var t = Object.keys(e);
              return a.a.flatMap(t, function(t) {
                return a.a.isPlainObject(e[t])
                  ? a.a.map(f.combineKeys(e[t]), function(e) {
                      return t + '.' + e;
                    })
                  : t;
              });
            }),
            (f._getCurrentApi = function() {
              return a.a.find(l, {value: f.target.apiEndpoints});
            }),
            (f.getServerFilterOptions = function(e, t) {
              if ('operator' === e.type)
                return f.$q.when(
                  f.uiSegmentSrv.newOperators(['==', '!=', 'in', 'notin', 'matches'])
                );
              if ('plus-button' === e.type || 'condition' === e.type)
                return f.$q.when(
                  a.a.map(['fieldSelector', 'labelSelector'], function(e) {
                    return f.uiSegmentSrv.newSegment({value: e});
                  })
                );
              var r = a.a.map(f.templateSrv.variables, function(e) {
                return '"$' + e.name + '"';
              });
              'fieldSelector' !== f.serverFilterSegments[t][0].value ||
                ((n = f._getCurrentApi()) &&
                  n.fieldSelectors.forEach(function(e) {
                    return r.push(e);
                  }));
              var n = a.a.map(r, function(e) {
                return f.uiSegmentSrv.newSegment(new String(e));
              });
              return f.$q.when(n);
            }),
            (f.onDataReceived = function() {
              0 < f.dataPreviewBuffer.length &&
                ((f.dataPreview = a.a.flatten(f.dataPreviewBuffer)),
                (f.dataPreviewBuffer = []));
            }),
            (f.onResponseReceived = function(e) {
              e.config.url.endsWith('/auth') || f.dataPreviewBuffer.push(e.data);
            }),
            (f.onRefresh = function() {
              f.dataPreview = {};
            }),
            h(f.target),
            (g = (i = f.target).clientSideFilters),
            (i = i.serverSideFilters),
            a()(g)
              .map(f._createClientFilterSegments)
              .each(function(e) {
                return f.clientFilterSegments.push(e);
              }),
            f.clientFilterSegments.push([f.uiSegmentSrv.newPlusButton()]),
            a()(i)
              .map(f._createServerFilterSegments)
              .each(function(e) {
                return f.serverFilterSegments.push(e);
              }),
            f.serverFilterSegments.push([f.uiSegmentSrv.newPlusButton()]),
            void 0 === f.target.fieldSelectors
              ? (f.target.fieldSelectors = [new b(f, '*')])
              : (f.target.fieldSelectors = a.a.map(f.target.fieldSelectors, function(e) {
                  return b.restore(f, e);
                })),
            void 0 === f.target.apiEndpoints && (f.target.apiEndpoints = l[0].value),
            void 0 === f.target.queryType && (f.target.queryType = f.queryTypes[0].value),
            void 0 === f.target.format && (f.target.format = f.formats[0].value),
            (f.addFieldSegment = f.uiSegmentSrv.newPlusButton()),
            void 0 !== f.target.aggregation && delete f.target.aggregation,
            void 0 === f.target.aggregationType &&
              (f.target.aggregationType = s[0].value),
            void 0 === f.target.aggregationRequiresTarget &&
              (f.target.aggregationRequiresTarget = s[0].requiresTarget),
            void 0 === f.target.aggregationField
              ? (f.segmentAggregationTarget = f.uiSegmentSrv.newFake(
                  'select target attribute',
                  'value',
                  'query-segment-value'
                ))
              : (f.segmentAggregationTarget = f.uiSegmentSrv.newSegment({
                  value: f.target.aggregationField,
                })),
            void 0 === f.target.groupBy
              ? (f.groupBySegment = f.uiSegmentSrv.newPlusButton())
              : (f.groupBySegment = f.uiSegmentSrv.newSegment({value: f.target.groupBy})),
            void 0 === f.target.namespace && (f.target.namespace = 'default'),
            (f.namespaceSegment = f.uiSegmentSrv.newSegment({value: f.target.namespace})),
            F.a.on('ds-request-response', f.onResponseReceived, e),
            f.panelCtrl.events.on('refresh', f.onRefresh, e),
            f.panelCtrl.events.on('data-received', f.onDataReceived, e),
            f.panelCtrl.refresh(),
            f
          );
        }
        var k = ((q.$inject = ['$scope']), (q.templateUrl = 'partials/config.html'), q);
        function q(e) {
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
      },
    ]),
    (a.c = u),
    (a.d = function(e, t, r) {
      a.o(e, t) || Object.defineProperty(e, t, {enumerable: !0, get: r});
    }),
    (a.r = function(e) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, {value: 'Module'}),
        Object.defineProperty(e, '__esModule', {value: !0});
    }),
    (a.t = function(e, t) {
      if ((1 & t && (e = a(e)), 8 & t)) return e;
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
      var r = Object.create(null);
      if (
        (a.r(r),
        Object.defineProperty(r, 'default', {enumerable: !0, value: e}),
        2 & t && 'string' != typeof e)
      )
        for (var n in e)
          a.d(
            r,
            n,
            function(t) {
              return e[t];
            }.bind(null, n)
          );
      return r;
    }),
    (a.n = function(e) {
      var t =
        e && e.__esModule
          ? function() {
              return e.default;
            }
          : function() {
              return e;
            };
      return a.d(t, 'a', t), t;
    }),
    (a.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (a.p = ''),
    a((a.s = 4))
  );
  function a(e) {
    if (u[e]) return u[e].exports;
    var t = (u[e] = {i: e, l: !1, exports: {}});
    return i[e].call(t.exports, t, t.exports, a), (t.l = !0), t.exports;
  }
  var i, u;
});
//# sourceMappingURL=module.js.map
