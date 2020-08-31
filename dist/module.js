define(['app/core/app_events', 'app/plugins/sdk', 'lodash', 'moment'], function(
  __WEBPACK_EXTERNAL_MODULE_grafana_app_core_app_events__,
  __WEBPACK_EXTERNAL_MODULE_grafana_app_plugins_sdk__,
  __WEBPACK_EXTERNAL_MODULE_lodash__,
  __WEBPACK_EXTERNAL_MODULE_moment__
) {
  return /******/ (function(modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {}; // The require function
    /******/
    /******/ /******/ function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/ if (installedModules[moduleId]) {
        /******/ return installedModules[moduleId].exports;
        /******/
      } // Create a new module (and put it into the cache)
      /******/ /******/ var module = (installedModules[moduleId] = {
        /******/ i: moduleId,
        /******/ l: false,
        /******/ exports: {},
        /******/
      }); // Execute the module function
      /******/
      /******/ /******/ modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      ); // Flag the module as loaded
      /******/
      /******/ /******/ module.l = true; // Return the exports of the module
      /******/
      /******/ /******/ return module.exports;
      /******/
    } // expose the modules object (__webpack_modules__)
    /******/
    /******/
    /******/ /******/ __webpack_require__.m = modules; // expose the module cache
    /******/
    /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
    /******/
    /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
      /******/ if (!__webpack_require__.o(exports, name)) {
        /******/ Object.defineProperty(exports, name, {enumerable: true, get: getter});
        /******/
      }
      /******/
    }; // define __esModule on exports
    /******/
    /******/ /******/ __webpack_require__.r = function(exports) {
      /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {value: 'Module'});
        /******/
      }
      /******/ Object.defineProperty(exports, '__esModule', {value: true});
      /******/
    }; // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
    /******/
    /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(
      value,
      mode
    ) {
      /******/ if (mode & 1) value = __webpack_require__(value);
      /******/ if (mode & 8) return value;
      /******/ if (mode & 4 && typeof value === 'object' && value && value.__esModule)
        return value;
      /******/ var ns = Object.create(null);
      /******/ __webpack_require__.r(ns);
      /******/ Object.defineProperty(ns, 'default', {enumerable: true, value: value});
      /******/ if (mode & 2 && typeof value != 'string')
        for (var key in value)
          __webpack_require__.d(
            ns,
            key,
            function(key) {
              return value[key];
            }.bind(null, key)
          );
      /******/ return ns;
      /******/
    }; // getDefaultExport function for compatibility with non-harmony modules
    /******/
    /******/ /******/ __webpack_require__.n = function(module) {
      /******/ var getter =
        module && module.__esModule
          ? /******/ function getDefault() {
              return module['default'];
            }
          : /******/ function getModuleExports() {
              return module;
            };
      /******/ __webpack_require__.d(getter, 'a', getter);
      /******/ return getter;
      /******/
    }; // Object.prototype.hasOwnProperty.call
    /******/
    /******/ /******/ __webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    }; // __webpack_public_path__
    /******/
    /******/ /******/ __webpack_require__.p = ''; // Load entry module and return exports
    /******/
    /******/
    /******/ /******/ return __webpack_require__((__webpack_require__.s = './module.ts'));
    /******/
  })(
    /************************************************************************/
    /******/ {
      /***/ './FieldSelector.ts':
        /*!**************************!*\
  !*** ./FieldSelector.ts ***!
  \**************************/
        /*! exports provided: default */
        /***/ function(module, __webpack_exports__, __webpack_require__) {
          'use strict';
          __webpack_require__.r(__webpack_exports__);
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
            /*! lodash */ 'lodash'
          );
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
            lodash__WEBPACK_IMPORTED_MODULE_0__
          );

          /**
           * Helper class for building field selectors.
           * This class should be refactored => no segments should be in `target` but directly in the query controller.
           */
          var FieldSelector = /** @class */ (function() {
            function FieldSelector(ctrl, initPath) {
              var _this = this;
              /**
               * Refreshes the selectors UI elements - if a segment changes its value.
               */
              this.refresh = function(ctrl) {
                if (!ctrl.dataPreview || ctrl.dataPreview.length <= 0) {
                  return;
                }
                var selection = ctrl.dataPreview[0];
                for (var i = 0; i < _this.fieldSegments.length; i++) {
                  var segment = _this.fieldSegments[i];
                  var value = segment.value;
                  if (selection) {
                    selection = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.get(
                      selection,
                      value
                    );
                  }
                  if (value === '*') {
                    _this.fieldSegments = _this.fieldSegments.slice(0, i + 1);
                  }
                }
                if (selection === undefined) {
                  _this.fieldType = 'undefined';
                } else if (
                  lodash__WEBPACK_IMPORTED_MODULE_0___default.a.isPlainObject(selection)
                ) {
                  _this.fieldSegments.push(ctrl.uiSegmentSrv.newKey('*'));
                  _this.fieldType = 'object';
                } else if (
                  lodash__WEBPACK_IMPORTED_MODULE_0___default.a.isArray(selection)
                ) {
                  _this.fieldType = 'array';
                } else if (typeof selection === 'number') {
                  _this.fieldType = 'number';
                } else {
                  _this.fieldType = 'string';
                }
                _this.attributePath = _this.getPath();
              };
              /**
               * Returns the current attribute path of this selector.
               */
              this.getPath = function() {
                return lodash__WEBPACK_IMPORTED_MODULE_0___default()(_this.fieldSegments)
                  .map(function(segment) {
                    return segment.value;
                  })
                  .join('.');
              };
              this.fieldSegments = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.map(
                initPath.split('.'),
                function(path) {
                  return ctrl.uiSegmentSrv.newKey(path);
                }
              );
              this.refresh(ctrl);
            }
            /**
             * Restores the segments based on the given parameters.
             */
            FieldSelector.restore = function(ctrl, segments) {
              var path = lodash__WEBPACK_IMPORTED_MODULE_0___default()(
                segments.fieldSegments
              )
                .map(function(segment) {
                  return segment.value;
                })
                .join('.');
              var selector = new FieldSelector(ctrl, path);
              selector.alias = segments.alias;
              return selector;
            };
            return FieldSelector;
          })();
          /* harmony default export */ __webpack_exports__['default'] = FieldSelector;

          /***/
        },

      /***/ './config_ctrl.ts':
        /*!************************!*\
  !*** ./config_ctrl.ts ***!
  \************************/
        /*! exports provided: SensuConfigCtrl */
        /***/ function(module, __webpack_exports__, __webpack_require__) {
          'use strict';
          __webpack_require__.r(__webpack_exports__);
          /* harmony export (binding) */ __webpack_require__.d(
            __webpack_exports__,
            'SensuConfigCtrl',
            function() {
              return SensuConfigCtrl;
            }
          );
          /**
           * Controller responsible for the configuration ui.
           */
          var SensuConfigCtrl = /** @class */ (function() {
            /** @ngInject **/
            function SensuConfigCtrl($scope) {
              var _this = this;
              /**
               * When the "Use API Key" option is toggled.
               */
              this.onUseApiKeyToggle = function() {
                var current = _this.current;
                if (current.jsonData.useApiKey) {
                  current.basicAuth = false;
                  _this.resetApiKey();
                }
              };
              /**
               * Resets the currely set API key.
               */
              this.resetApiKey = function() {
                _this.current.secureJsonFields.apiKey = false;
                _this.current.secureJsonData = _this.current.secureJsonData || {};
                _this.current.secureJsonData.apiKey = '';
              };
              $scope.$watch(
                function() {
                  return _this.current.url;
                },
                function(value) {
                  return (_this.current.jsonData.currentUrl = value);
                }
              );
              $scope.$watch(
                function() {
                  return _this.current.basicAuth;
                },
                function(value) {
                  if (value) {
                    _this.current.jsonData.useApiKey = false;
                  }
                }
              );
            }
            SensuConfigCtrl.templateUrl = 'partials/config.html';
            return SensuConfigCtrl;
          })();

          /***/
        },

      /***/ './constants.ts':
        /*!**********************!*\
  !*** ./constants.ts ***!
  \**********************/
        /*! exports provided: DEFAULT_LIMIT, DEFAULT_AGGREGATION_LIMIT, AGGREGATION_TYPES, API_ENDPOINTS, QUERY_TYPES, FORMATS, TIME_PROPERTIES */
        /***/ function(module, __webpack_exports__, __webpack_require__) {
          'use strict';
          __webpack_require__.r(__webpack_exports__);
          /* harmony export (binding) */ __webpack_require__.d(
            __webpack_exports__,
            'DEFAULT_LIMIT',
            function() {
              return DEFAULT_LIMIT;
            }
          );
          /* harmony export (binding) */ __webpack_require__.d(
            __webpack_exports__,
            'DEFAULT_AGGREGATION_LIMIT',
            function() {
              return DEFAULT_AGGREGATION_LIMIT;
            }
          );
          /* harmony export (binding) */ __webpack_require__.d(
            __webpack_exports__,
            'AGGREGATION_TYPES',
            function() {
              return AGGREGATION_TYPES;
            }
          );
          /* harmony export (binding) */ __webpack_require__.d(
            __webpack_exports__,
            'API_ENDPOINTS',
            function() {
              return API_ENDPOINTS;
            }
          );
          /* harmony export (binding) */ __webpack_require__.d(
            __webpack_exports__,
            'QUERY_TYPES',
            function() {
              return QUERY_TYPES;
            }
          );
          /* harmony export (binding) */ __webpack_require__.d(
            __webpack_exports__,
            'FORMATS',
            function() {
              return FORMATS;
            }
          );
          /* harmony export (binding) */ __webpack_require__.d(
            __webpack_exports__,
            'TIME_PROPERTIES',
            function() {
              return TIME_PROPERTIES;
            }
          );
          /**
           * The default limit.
           */
          var DEFAULT_LIMIT = 100;
          /**
           * The default limit for aggregation queries.
           */
          var DEFAULT_AGGREGATION_LIMIT = 0;
          /**
           * Supported aggregation functions.
           */
          var AGGREGATION_TYPES = [
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
          var API_ENDPOINTS = [
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
          var QUERY_TYPES = [
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
          var FORMATS = [
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
          var TIME_PROPERTIES = [
            'timestamp',
            'check.executed',
            'check.issued',
            'check.last_ok',
            'entity.last_seen',
            'last_seen',
          ];

          /***/
        },

      /***/ './datasource.ts':
        /*!***********************!*\
  !*** ./datasource.ts ***!
  \***********************/
        /*! exports provided: default */
        /***/ function(module, __webpack_exports__, __webpack_require__) {
          'use strict';
          __webpack_require__.r(__webpack_exports__);
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
            /*! lodash */ 'lodash'
          );
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
            lodash__WEBPACK_IMPORTED_MODULE_0__
          );
          /* harmony import */ var _sensu_sensu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
            /*! ./sensu/sensu */ './sensu/sensu.ts'
          );
          /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
            /*! ./constants */ './constants.ts'
          );
          /* harmony import */ var _utils_datasource_filter_util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
            /*! ./utils/datasource_filter_util */ './utils/datasource_filter_util.ts'
          );
          /* harmony import */ var _utils_query_util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
            /*! ./utils/query_util */ './utils/query_util.ts'
          );
          /* harmony import */ var _transformer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
            /*! ./transformer */ './transformer/index.ts'
          );
          /* harmony import */ var _utils_config_migration_util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
            /*! ./utils/config_migration_util */ './utils/config_migration_util.ts'
          );
          /* harmony import */ var _utils_data_aggregation_util__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
            /*! ./utils/data_aggregation_util */ './utils/data_aggregation_util.ts'
          );

          var SensuDatasource = /** @class */ (function() {
            /** @ngInject */
            function SensuDatasource(instanceSettings, backendSrv, templateSrv) {
              var _this = this;
              this.instanceSettings = instanceSettings;
              this.backendSrv = backendSrv;
              this.templateSrv = templateSrv;
              /**
               * Preprocces the query targets like resolving template variables.
               */
              this.prepareQuery = function(target, queryOptions) {
                // resolve API url
                var apiUrl = _this._getApiUrl(target);
                // resolve filters
                var clientFilters = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.cloneDeep(
                  target.clientSideFilters
                );
                var serverFilters = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.cloneDeep(
                  target.serverSideFilters
                );
                var preparedTarget = {
                  apiUrl: apiUrl,
                  clientFilters: clientFilters,
                  serverFilters: serverFilters,
                  target: lodash__WEBPACK_IMPORTED_MODULE_0___default.a.cloneDeep(target),
                };
                _this._resolveTemplateVariables(preparedTarget, queryOptions);
                return preparedTarget;
              };
              /**
               * Resolves template variables in the given prepared target.
               */
              this._resolveTemplateVariables = function(preparedTarget, queryOptions) {
                var target = preparedTarget.target,
                  clientFilters = preparedTarget.clientFilters,
                  serverFilters = preparedTarget.serverFilters;
                // resolve variables in namespaces
                var namespaces = _this.templateSrv
                  .replace(target.namespace, queryOptions.scopedVars, 'pipe')
                  .split('|');
                target.namespaces = namespaces;
                // resolve variables in filters
                [clientFilters, serverFilters].forEach(function(filters) {
                  return filters.forEach(function(filter) {
                    filter.key = _this.templateSrv.replace(
                      filter.key,
                      queryOptions.scopedVars,
                      'csv'
                    );
                    filter.value = _this.templateSrv.replace(
                      filter.value,
                      queryOptions.scopedVars,
                      'regex'
                    );
                  });
                });
              };
              /**
               * Returns the url of the API used by the given target.
               */
              this._getApiUrl = function(target) {
                var apiEndpoint = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.find(
                  _constants__WEBPACK_IMPORTED_MODULE_2__['API_ENDPOINTS'],
                  {value: target.apiEndpoints}
                );
                if (apiEndpoint) {
                  return apiEndpoint.url;
                } else {
                  return _constants__WEBPACK_IMPORTED_MODULE_2__['API_ENDPOINTS'][0].url;
                }
              };
              /**
               * Converting the timestamps from seconds to miliseconds because Sensu's timestamp
               * resolution is in seconds but Grafana uses miliseconds.
               */
              this._timeCorrection = function(data) {
                lodash__WEBPACK_IMPORTED_MODULE_0___default.a.each(data, function(
                  dataElement
                ) {
                  // iterate over all time properties
                  lodash__WEBPACK_IMPORTED_MODULE_0___default.a.each(
                    _constants__WEBPACK_IMPORTED_MODULE_2__['TIME_PROPERTIES'],
                    function(property) {
                      // fetch the properties value
                      var time = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.get(
                        dataElement,
                        property,
                        -1
                      );
                      // in case a time is set, we multiply them by 1000 to get miliseconds.
                      // in case the time is 0, we'll remove it, otherwise Grafana will display the epoch's starting times
                      if (time > 0) {
                        lodash__WEBPACK_IMPORTED_MODULE_0___default.a.set(
                          dataElement,
                          property,
                          time * 1000
                        );
                      } else {
                        lodash__WEBPACK_IMPORTED_MODULE_0___default.a.unset(
                          dataElement,
                          property
                        );
                      }
                    }
                  );
                });
                return data;
              };
              /**
               * This function will group the given data (if specified in the PreparedTarget) and aggregate it accordingly.
               *
               * @param data the data to group and aggregate
               * @param prepTarget the settings for the grouping and aggregation
               */
              this._queryGroupAndAggregate = function(data, prepTarget) {
                var _a = prepTarget.target,
                  alias = _a.aggregationAlias,
                  type = _a.aggregationType,
                  format = _a.format,
                  groupAttribute = _a.groupBy;
                // the name of the result value (the metric name if timeseries format is used, otherwise the column header)
                var name = alias ? alias : type || 'value';
                if (!groupAttribute) {
                  // just aggregate without grouping
                  var aggregationResult = _this._queryAggregation(data, name, prepTarget);
                  return [aggregationResult];
                } else {
                  // first group the data..
                  var groups = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.groupBy(
                    data,
                    groupAttribute
                  );
                  // ..then aggregate the individual groups
                  var groupResult = lodash__WEBPACK_IMPORTED_MODULE_0___default()(groups)
                    .map(function(dataGroup, groupKey) {
                      return _this._queryAggregation(dataGroup, groupKey, prepTarget);
                    })
                    .value();
                  if ((format === 'table' || format === 'table-v') && groupResult) {
                    var groupAlias = prepTarget.target.groupAlias;
                    // we transform the groups into multiple columns in case the table format is used
                    return _this._mergeTableAggregation(
                      groupResult,
                      groupAlias || groupAttribute,
                      name
                    );
                  } else {
                    return groupResult;
                  }
                }
              };
              /**
               * We merge the seperate aggregation result into a single one, thus we get a nicer visualization
               * in the table panel, where the group-attribute and value have their own column.
               */
              this._mergeTableAggregation = function(groupData, groupByAttribute, alias) {
                return lodash__WEBPACK_IMPORTED_MODULE_0___default()(groupData)
                  .map(function(group) {
                    if (!group || group.length == 0) {
                      return null;
                    }
                    var point = group[0];
                    return [
                      {
                        name: groupByAttribute,
                        value: point.name,
                      },
                      {
                        name: alias,
                        value: point.value,
                      },
                    ];
                  })
                  .filter() // null values
                  .value();
              };
              /**
               * Process the data if the query type is 'aggregation'.
               */
              this._queryAggregation = function(data, name, prepTarget) {
                var type = prepTarget.target.aggregationType;
                if (type === 'count') {
                  return _utils_data_aggregation_util__WEBPACK_IMPORTED_MODULE_7__[
                    'default'
                  ].count(data, name);
                } else if (type === 'sum') {
                  var aggregationField = prepTarget.target.aggregationField;
                  return _utils_data_aggregation_util__WEBPACK_IMPORTED_MODULE_7__[
                    'default'
                  ].sum(data, name, aggregationField);
                } else {
                  throw new Error('The aggreation type "' + type + '" is not supported.');
                }
              };
              /**
               * Process the data if the query type is 'field'.
               */
              this._queryFieldSelection = function(data, fieldSelectors) {
                var columnMappings = _this._extractColumnMappings(data, fieldSelectors);
                var resultData = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.map(
                  data,
                  function(dataElement) {
                    // extract selected data
                    return lodash__WEBPACK_IMPORTED_MODULE_0___default.a.map(
                      columnMappings,
                      function(mapping) {
                        var value = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.get(
                          dataElement,
                          mapping.path
                        );
                        return {
                          name: mapping.alias,
                          value: value,
                        };
                      }
                    );
                  }
                );
                return resultData;
              };
              /**
               * Creates a column mapping - which object attribute/path is related to which column.
               */
              this._extractColumnMappings = function(data, fieldSelectors) {
                var result = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.flatMap(
                  fieldSelectors,
                  function(selector) {
                    var paths = lodash__WEBPACK_IMPORTED_MODULE_0___default()(data)
                      .map(function(dataElement) {
                        return _this.resolvePaths(selector, dataElement);
                      })
                      .flatMap()
                      .uniq()
                      .value();
                    if (selector.alias) {
                      if (paths.length > 1) {
                        // use the alias in combination with an index as column name
                        return lodash__WEBPACK_IMPORTED_MODULE_0___default.a.map(
                          paths,
                          function(path, index) {
                            return {
                              path: path,
                              alias: selector.alias + '.' + index,
                            };
                          }
                        );
                      } else {
                        // use the alias instead the path as column name
                        return lodash__WEBPACK_IMPORTED_MODULE_0___default.a.map(
                          paths,
                          function(path) {
                            return {
                              path: path,
                              alias: selector.alias,
                            };
                          }
                        );
                      }
                    } else {
                      // use the path itself as column name
                      return lodash__WEBPACK_IMPORTED_MODULE_0___default.a.map(
                        paths,
                        function(path) {
                          return {
                            path: path,
                            alias: path,
                          };
                        }
                      );
                    }
                  }
                );
                return result;
              };
              /**
               * Returns a filtered representation of the given data.
               */
              this._filterData = function(data, filters) {
                return lodash__WEBPACK_IMPORTED_MODULE_0___default.a.filter(
                  data,
                  function(dataElement) {
                    return lodash__WEBPACK_IMPORTED_MODULE_0___default.a.every(
                      filters,
                      function(filter) {
                        return _this._matches(dataElement, filter);
                      }
                    );
                  }
                );
              };
              /**
               * Returns whether the given element matches the given filter.
               */
              this._matches = function(element, filter) {
                var filterKey = filter.key;
                var matcher = filter.matcher;
                var filterValue = filter.value;
                var elementValue = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.get(
                  element,
                  filterKey
                );
                return _utils_datasource_filter_util__WEBPACK_IMPORTED_MODULE_3__[
                  'default'
                ].matchs(filterValue, matcher, elementValue);
              };
              /**
               * Resolves all existing paths of the specified selector based on the given data.
               * Example: if the selector is '*' all possible attibutes (including nested) will be returned.
               */
              this.resolvePaths = function(selector, data) {
                var selection = data;
                var lastSelector = '';
                var basePath = '';
                for (var i = 0; i < selector.fieldSegments.length; i++) {
                  var segment = selector.fieldSegments[i];
                  lastSelector = segment.value;
                  if (lastSelector !== '*') {
                    if (basePath === '') {
                      basePath = lastSelector;
                    } else {
                      basePath = basePath + '.' + lastSelector;
                    }
                    selection = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.get(
                      selection,
                      lastSelector
                    );
                  }
                }
                if (lastSelector === '*') {
                  var paths = _this._deepResolve(selection);
                  if (basePath === '') {
                    return paths;
                  } else {
                    return lodash__WEBPACK_IMPORTED_MODULE_0___default.a.map(
                      paths,
                      function(path) {
                        return basePath + '.' + path;
                      }
                    );
                  }
                } else {
                  return [basePath];
                }
              };
              this._deepResolve = function(data) {
                var keys = Object.keys(data);
                return lodash__WEBPACK_IMPORTED_MODULE_0___default.a.flatMap(
                  keys,
                  function(key) {
                    if (
                      lodash__WEBPACK_IMPORTED_MODULE_0___default.a.isPlainObject(
                        data[key]
                      )
                    ) {
                      return lodash__WEBPACK_IMPORTED_MODULE_0___default.a.map(
                        _this._deepResolve(data[key]),
                        function(nestedKeys) {
                          return key + '.' + nestedKeys;
                        }
                      );
                    } else {
                      return key;
                    }
                  }
                );
              };
              /**
               * Executes the given query command.
               */
              this._query = function(query) {
                var queryComponents = _utils_query_util__WEBPACK_IMPORTED_MODULE_4__[
                  'default'
                ].extractQueryComponents(query);
                if (queryComponents === null) {
                  return Promise.resolve([]);
                }
                var options = _this._transformQueryComponentsToQueryOptions(
                  queryComponents
                );
                options.resultAsPlainArray = true;
                return _this.query(options);
              };
              /**
               * Transforms the given query components into an options object which can be used by the `query(..)` function.
               */
              this._transformQueryComponentsToQueryOptions = function(queryComponents) {
                var apiKey = queryComponents.apiKey,
                  selectedField = queryComponents.selectedField,
                  clientFilters = queryComponents.clientFilters,
                  serverFilters = queryComponents.serverFilters,
                  namespace = queryComponents.namespace,
                  limit = queryComponents.limit;
                var options = {
                  targets: [
                    {
                      apiEndpoints: apiKey,
                      queryType: 'field',
                      namespace: namespace,
                      limit: lodash__WEBPACK_IMPORTED_MODULE_0___default.a.isNaN(limit)
                        ? null
                        : new String(limit),
                      fieldSelectors: [
                        {
                          fieldSegments: [
                            {
                              value: selectedField,
                            },
                          ],
                        },
                      ],
                      format: 'table',
                      clientSideFilters: clientFilters,
                      serverSideFilters: serverFilters,
                      version: 2,
                    },
                  ],
                };
                return options;
              };
              this.url = instanceSettings.url.trim();
            }
            /**
             * Executes a query.
             */
            SensuDatasource.prototype.query = function(queryOptions) {
              var _this = this;
              var queryTargets = lodash__WEBPACK_IMPORTED_MODULE_0___default()(
                queryOptions.targets
              )
                .map(
                  _utils_config_migration_util__WEBPACK_IMPORTED_MODULE_6__['default']
                    .migrate
                )
                .map(function(target) {
                  return _this.prepareQuery(target, queryOptions);
                })
                .value();
              // empty result in case there is no query defined
              if (queryTargets.length === 0) {
                return Promise.resolve({data: []});
              }
              var queries = queryTargets.map(function(prepTarget) {
                var apiUrl = prepTarget.apiUrl,
                  clientFilters = prepTarget.clientFilters,
                  serverFilters = prepTarget.serverFilters,
                  _a = prepTarget.target,
                  queryType = _a.queryType,
                  fieldSelectors = _a.fieldSelectors,
                  namespaces = _a.namespaces,
                  limit = _a.limit;
                // verify and set correct limit
                var parsedLimit = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.defaultTo(
                  parseInt(limit || ''),
                  -1
                );
                if (parsedLimit < 0) {
                  if (queryType === 'aggregation') {
                    parsedLimit =
                      _constants__WEBPACK_IMPORTED_MODULE_2__[
                        'DEFAULT_AGGREGATION_LIMIT'
                      ];
                  } else {
                    parsedLimit =
                      _constants__WEBPACK_IMPORTED_MODULE_2__['DEFAULT_LIMIT'];
                  }
                }
                var queryOptions = {
                  method: 'GET',
                  url: apiUrl,
                  namespaces: namespaces,
                  limit: parsedLimit,
                  responseFilters: serverFilters,
                };
                return _sensu_sensu__WEBPACK_IMPORTED_MODULE_1__['default']
                  .query(_this, queryOptions)
                  .then(_this._timeCorrection)
                  .then(function(data) {
                    return _this._filterData(data, clientFilters);
                  })
                  .then(function(data) {
                    if (queryType === 'field') {
                      return _this._queryFieldSelection(data, fieldSelectors);
                    } else if (queryType === 'aggregation') {
                      return _this._queryGroupAndAggregate(data, prepTarget);
                    } else {
                      return [];
                    }
                  });
              });
              return Promise.all(queries).then(function(queryResults) {
                if (queryOptions.resultAsPlainArray) {
                  // return only values - e.g. for template variables
                  var result = lodash__WEBPACK_IMPORTED_MODULE_0___default()(queryResults)
                    .map(function(result) {
                      return _transformer__WEBPACK_IMPORTED_MODULE_5__['default'].toTable(
                        result,
                        false
                      );
                    })
                    .map(function(result) {
                      return result.rows;
                    })
                    .flatten()
                    .flatten()
                    .filter()
                    .map(function(value) {
                      return {text: value};
                    })
                    .value();
                  return result;
                } else {
                  var resultDataList = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.flatMap(
                    queryResults,
                    function(queryResult, index) {
                      var format = queryTargets[index].target.format;
                      if (format === 'series') {
                        // return time series format
                        return _transformer__WEBPACK_IMPORTED_MODULE_5__[
                          'default'
                        ].toTimeSeries(queryResult);
                      } else {
                        var isVertical = format === 'table-v';
                        // return table format
                        return _transformer__WEBPACK_IMPORTED_MODULE_5__[
                          'default'
                        ].toTable(queryResult, isVertical);
                      }
                    }
                  );
                  return {
                    data: resultDataList,
                  };
                }
              });
            };
            /**
             * Executes a query based on the given query command which is a string representation of it.
             */
            SensuDatasource.prototype.metricFindQuery = function(query) {
              return this._query(query);
            };
            /**
             * Used by the config UI to test a datasource.
             */
            SensuDatasource.prototype.testDatasource = function() {
              var useApiKey = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.get(
                this.instanceSettings,
                'jsonData.useApiKey',
                false
              );
              // the /auth/test endpoint is only available for testing basic auth credentials
              var testUrl = useApiKey ? '/api/core/v2/namespaces' : '/auth/test';
              return _sensu_sensu__WEBPACK_IMPORTED_MODULE_1__['default']
                ._request(this, 'GET', testUrl)
                .then(function() {
                  return {
                    status: 'success',
                    message: 'Successfully connected against the Sensu Go API',
                  };
                })
                .catch(function(error) {
                  if (useApiKey && error.data === 'access_error') {
                    return {
                      status: 'error',
                      message: 'API Key Invalid: Could not logged in using API key',
                    };
                  }
                  return {status: 'error', message: error.message};
                });
            };
            return SensuDatasource;
          })();
          /* harmony default export */ __webpack_exports__['default'] = SensuDatasource;

          /***/
        },

      /***/ './module.ts':
        /*!*******************!*\
  !*** ./module.ts ***!
  \*******************/
        /*! exports provided: Datasource, QueryCtrl, ConfigCtrl */
        /***/ function(module, __webpack_exports__, __webpack_require__) {
          'use strict';
          __webpack_require__.r(__webpack_exports__);
          /* harmony import */ var _datasource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
            /*! ./datasource */ './datasource.ts'
          );
          /* harmony reexport (safe) */ __webpack_require__.d(
            __webpack_exports__,
            'Datasource',
            function() {
              return _datasource__WEBPACK_IMPORTED_MODULE_0__['default'];
            }
          );

          /* harmony import */ var _query_ctrl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
            /*! ./query_ctrl */ './query_ctrl.ts'
          );
          /* harmony reexport (safe) */ __webpack_require__.d(
            __webpack_exports__,
            'QueryCtrl',
            function() {
              return _query_ctrl__WEBPACK_IMPORTED_MODULE_1__['SensuQueryCtrl'];
            }
          );

          /* harmony import */ var _config_ctrl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
            /*! ./config_ctrl */ './config_ctrl.ts'
          );
          /* harmony reexport (safe) */ __webpack_require__.d(
            __webpack_exports__,
            'ConfigCtrl',
            function() {
              return _config_ctrl__WEBPACK_IMPORTED_MODULE_2__['SensuConfigCtrl'];
            }
          );

          /***/
        },

      /***/ './query_ctrl.ts':
        /*!***********************!*\
  !*** ./query_ctrl.ts ***!
  \***********************/
        /*! exports provided: SensuQueryCtrl */
        /***/ function(module, __webpack_exports__, __webpack_require__) {
          'use strict';
          __webpack_require__.r(__webpack_exports__);
          /* harmony export (binding) */ __webpack_require__.d(
            __webpack_exports__,
            'SensuQueryCtrl',
            function() {
              return SensuQueryCtrl;
            }
          );
          /* harmony import */ var grafana_app_core_app_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
            /*! grafana/app/core/app_events */ 'grafana/app/core/app_events'
          );
          /* harmony import */ var grafana_app_core_app_events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
            grafana_app_core_app_events__WEBPACK_IMPORTED_MODULE_0__
          );
          /* harmony import */ var grafana_app_plugins_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
            /*! grafana/app/plugins/sdk */ 'grafana/app/plugins/sdk'
          );
          /* harmony import */ var grafana_app_plugins_sdk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
            grafana_app_plugins_sdk__WEBPACK_IMPORTED_MODULE_1__
          );
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
            /*! lodash */ 'lodash'
          );
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
            lodash__WEBPACK_IMPORTED_MODULE_2__
          );
          /* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
            /*! ./types */ './types.ts'
          );
          /* harmony import */ var _FieldSelector__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
            /*! ./FieldSelector */ './FieldSelector.ts'
          );
          /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
            /*! ./constants */ './constants.ts'
          );
          /* harmony import */ var _utils_query_util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
            /*! ./utils/query_util */ './utils/query_util.ts'
          );
          /* harmony import */ var _sensu_sensu__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
            /*! ./sensu/sensu */ './sensu/sensu.ts'
          );
          /* harmony import */ var _utils_config_migration_util__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
            /*! ./utils/config_migration_util */ './utils/config_migration_util.ts'
          );
          var __extends =
            (undefined && undefined.__extends) ||
            (function() {
              var extendStatics = function(d, b) {
                extendStatics =
                  Object.setPrototypeOf ||
                  ({__proto__: []} instanceof Array &&
                    function(d, b) {
                      d.__proto__ = b;
                    }) ||
                  function(d, b) {
                    for (var p in b)
                      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                  };
                return extendStatics(d, b);
              };
              return function(d, b) {
                extendStatics(d, b);
                function __() {
                  this.constructor = d;
                }
                d.prototype =
                  b === null
                    ? Object.create(b)
                    : ((__.prototype = b.prototype), new __());
              };
            })();

          var SensuQueryCtrl = /** @class */ (function(_super) {
            __extends(SensuQueryCtrl, _super);
            /** @ngInject **/
            function SensuQueryCtrl($scope, $injector, $q, uiSegmentSrv, templateSrv) {
              var _this = _super.call(this, $scope, $injector) || this;
              _this.$q = $q;
              _this.uiSegmentSrv = uiSegmentSrv;
              _this.templateSrv = templateSrv;
              // Constants
              _this.aggregationTypes =
                _constants__WEBPACK_IMPORTED_MODULE_5__['AGGREGATION_TYPES'];
              _this.queryTypes = _constants__WEBPACK_IMPORTED_MODULE_5__['QUERY_TYPES'];
              _this.formats = _constants__WEBPACK_IMPORTED_MODULE_5__['FORMATS'];
              _this.dataPreview = {};
              _this.dataPreviewBuffer = [];
              _this.apiEndpoints =
                _constants__WEBPACK_IMPORTED_MODULE_5__['API_ENDPOINTS']; // used in the partial
              _this.clientFilterSegments = [];
              _this.serverFilterSegments = [];
              /**
               * Creates an array containg segments which represent a in-browser filter. The first segment represents the filter-key,
               * the second the operator and the third the filter-value.
               */
              _this._createClientFilterSegments = function(filter) {
                var segmentArray = [
                  _this.uiSegmentSrv.newKey(filter.key),
                  _this.uiSegmentSrv.newOperator(filter.matcher),
                  _this.uiSegmentSrv.newKeyValue(filter.value),
                ];
                return segmentArray;
              };
              /**
               * Creates an array containg segments which represent a response filter (sever-side). The first segment represents the type
               * of the filer (labelSelector or fieldSelector), the second the filter-key, the third the operator and the fourth the filter-value.
               */
              _this._createServerFilterSegments = function(filter) {
                var type =
                  filter.type ===
                  _types__WEBPACK_IMPORTED_MODULE_3__['ServerSideFilterType'].FIELD
                    ? 'fieldSelector'
                    : 'labelSelector';
                var segmentArray = [
                  _this.uiSegmentSrv.newCondition(type),
                  _this.uiSegmentSrv.newKey(filter.key),
                  _this.uiSegmentSrv.newOperator(filter.matcher),
                  _this.uiSegmentSrv.newKeyValue(filter.value),
                ];
                return segmentArray;
              };
              /**
               * Returns the currently selected aggregation type.
               */
              _this.getCurrentAggregationType = function() {
                return lodash__WEBPACK_IMPORTED_MODULE_2___default.a.find(
                  _constants__WEBPACK_IMPORTED_MODULE_5__['AGGREGATION_TYPES'],
                  {
                    value: _this.target.aggregationType,
                  }
                );
              };
              /**
               * Called if the aggregation field changes.
               */
              _this.onAggregationFieldChange = function() {
                _this.target.aggregationField = _this.segmentAggregationTarget.value;
                _this.panelCtrl.refresh();
              };
              /**
               * Called if the aggregation type changes.
               */
              _this.onAggregationTypeChange = function() {
                _this.target.aggregationRequiresTarget = _this.getCurrentAggregationType().requiresTarget;
                _this._resetAggregation();
                _this.panelCtrl.refresh();
              };
              /**
               * Resets the aggregation options.
               */
              _this._resetAggregation = function() {
                delete _this.target.aggregationAlias;
                delete _this.target.aggregationField;
                _this.removeGroupBy();
                _this.segmentAggregationTarget = _this.uiSegmentSrv.newFake(
                  'select target attribute',
                  'value',
                  'query-segment-value'
                );
              };
              /**
               * Returns selectable options (all existing keys) for the aggregation field segment.
               */
              _this.getTargetOptions = function() {
                var options = _this.getAllDeepKeys();
                var segments = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.map(
                  options,
                  function(option) {
                    return _this.uiSegmentSrv.newSegment({value: option});
                  }
                );
                return _this.$q.when(segments);
              };
              /**
               * Returns selectable options (all existing keys) for the group-by segment.
               */
              _this.getGroupByOptions = function() {
                var options = _this.getAllDeepKeys();
                var segments = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.map(
                  options,
                  function(option) {
                    return _this.uiSegmentSrv.newSegment({value: option});
                  }
                );
                return _this.$q.when(segments);
              };
              /**
               * Called when the user changes the groupBy attribute.
               */
              _this.onGroupByChange = function() {
                _this.target.groupBy = _this.groupBySegment.value;
                _this.panelCtrl.refresh();
              };
              /**
               * Removes the groupBy attribute.
               */
              _this.removeGroupBy = function() {
                _this.groupBySegment = _this.uiSegmentSrv.newPlusButton();
                delete _this.target.groupBy;
                delete _this.target.groupAlias;
                _this.panelCtrl.refresh();
              };
              /**
               * Returns selectable options for the namespace segment.
               */
              _this.getNamespaceOptions = function() {
                return _sensu_sensu__WEBPACK_IMPORTED_MODULE_7__['default']
                  .query(_this.datasource, {
                    method: 'GET',
                    url: '/namespaces',
                    namespaces: [],
                    limit: 0,
                    responseFilters: [],
                  })
                  .then(function(result) {
                    // get existing namespaces based on query result
                    var namespaces = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.map(
                      result,
                      function(namespace) {
                        return namespace.name;
                      }
                    );
                    // add all option
                    namespaces.unshift('*');
                    // add template variables
                    lodash__WEBPACK_IMPORTED_MODULE_2___default.a.each(
                      _this.templateSrv.variables,
                      function(variable) {
                        return namespaces.unshift('$' + variable.name);
                      }
                    );
                    return lodash__WEBPACK_IMPORTED_MODULE_2___default.a.map(
                      namespaces,
                      function(option) {
                        return _this.uiSegmentSrv.newSegment({value: option});
                      }
                    );
                  })
                  .catch(function() {
                    return [];
                  });
              };
              /**
               * Called of the namespace is changing.
               */
              _this.onNamespaceChange = function() {
                _this.target.namespace = _this.namespaceSegment.value;
                _this.panelCtrl.refresh();
              };
              /**
               * Resets the field and filter segments.
               */
              _this._reset = function() {
                _this.target.fieldSelectors = [
                  new _FieldSelector__WEBPACK_IMPORTED_MODULE_4__['default'](_this, '*'),
                ];
                _this.clientFilterSegments = [[_this.uiSegmentSrv.newPlusButton()]];
                _this.serverFilterSegments = [[_this.uiSegmentSrv.newPlusButton()]];
                _this._updateFilterTarget();
              };
              /**
               * Called when the api is changing.
               */
              _this.onApiChange = function() {
                _this._reset();
                _this.panelCtrl.refresh();
              };
              /**
               * Called when the query type is changing.
               */
              _this.onQueryTypeChange = function() {
                _this._resetAggregation();
                _this.panelCtrl.refresh();
              };
              /**
               * Removes the filter at the given index.
               */
              _this.removeFilter = function(index, isServerFilter) {
                var targetArray = isServerFilter
                  ? _this.serverFilterSegments
                  : _this.clientFilterSegments;
                targetArray.splice(index, 1);
                _this._updateFilterTarget();
                _this.panelCtrl.refresh();
              };
              /**
               * Called when a filter is changing.
               */
              _this.onFilterSegmentUpdate = function(segment, parentIndex, index) {
                if (segment.type === 'plus-button') {
                  _this._addClientFilterSegment(segment);
                  return;
                }
                if (index == 2) {
                  var segmentValue = segment.value;
                  if (/\/.*\/\w*/.test(segmentValue)) {
                    _this.clientFilterSegments[
                      parentIndex
                    ][1] = _this.uiSegmentSrv.newOperator('=~');
                  }
                }
                _this._updateFilterTarget();
                _this.panelCtrl.refresh();
              };
              /**
               * Adds a new in-browser filter.
               */
              _this._addClientFilterSegment = function(sourceSegment) {
                var segmentArray = [
                  _this.uiSegmentSrv.newKey(sourceSegment.value),
                  _this.uiSegmentSrv.newOperator('=='),
                  _this.uiSegmentSrv.newFake(
                    'select filter value',
                    'value',
                    'query-segment-value'
                  ),
                ];
                _this.clientFilterSegments.pop();
                _this.clientFilterSegments.push(segmentArray);
                _this.clientFilterSegments.push([_this.uiSegmentSrv.newPlusButton()]);
              };
              /**
               * Adds a new response filter.
               */
              _this._addServerFilterSegment = function(sourceSegment) {
                var segmentArray = [
                  _this.uiSegmentSrv.newCondition(sourceSegment.value),
                  _this.uiSegmentSrv.newFake(
                    'select filter key',
                    'value',
                    'query-segment-value'
                  ),
                  _this.uiSegmentSrv.newOperator('=='),
                  _this.uiSegmentSrv.newFake(
                    'select filter value',
                    'value',
                    'query-segment-value'
                  ),
                ];
                _this.serverFilterSegments.pop();
                _this.serverFilterSegments.push(segmentArray);
                _this.serverFilterSegments.push([_this.uiSegmentSrv.newPlusButton()]);
              };
              /**
               * Called when a response filter configuration is changed.
               *
               * @param segment the segment which has been changed
               */
              _this.onServerFilterSegmentUpdate = function(segment) {
                if (segment.type === 'plus-button') {
                  _this._addServerFilterSegment(segment);
                  return;
                }
                _this._updateFilterTarget();
                _this.panelCtrl.refresh();
              };
              /**
               * Returns selectable options for filter segments.
               */
              _this.getFilterSegmentOptions = function(segment, parentIndex, index) {
                var segments = [];
                if (segment.type === 'operator') {
                  segments = _this.uiSegmentSrv.newOperators([
                    '==',
                    '=~',
                    '!=',
                    '!~',
                    '<',
                    '>',
                  ]);
                } else if (_this.dataPreview && _this.dataPreview.length > 0) {
                  var options_1 = [];
                  if (index === 0) {
                    options_1 = _this.getAllDeepKeys();
                  } else if (index === 2) {
                    var filterKey_1 = _this.clientFilterSegments[parentIndex][0].value;
                    options_1 = lodash__WEBPACK_IMPORTED_MODULE_2___default()(
                      _this.dataPreview
                    )
                      .map(function(data) {
                        return lodash__WEBPACK_IMPORTED_MODULE_2___default.a.get(
                          data,
                          filterKey_1
                        );
                      })
                      .uniq()
                      .value();
                    lodash__WEBPACK_IMPORTED_MODULE_2___default.a.each(
                      _this.templateSrv.variables,
                      function(variable) {
                        return options_1.unshift('/$' + variable.name + '/');
                      }
                    );
                  }
                  segments = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.map(
                    options_1,
                    function(option) {
                      return _this.uiSegmentSrv.newSegment(String(option));
                    }
                  );
                }
                return _this.$q.when(segments);
              };
              /**
               * The segments which represents the specified filters will not be persisted and passed to the data source.
               * Instead, an object is created which represents the filters which is passed to the data source and
               * persisted by Grafana. Calling this method syncs the object (target) and updates its value to match the
               * segments' values specified by the user.
               */
              _this._updateFilterTarget = function() {
                var target = _this.target;
                // update client filters
                var clientFilters = lodash__WEBPACK_IMPORTED_MODULE_2___default()(
                  _this.clientFilterSegments
                )
                  .filter(function(segmentArray) {
                    return segmentArray.length === 3;
                  })
                  .filter(function(segmentArray) {
                    return !segmentArray[2].fake;
                  })
                  .map(function(segmentArray) {
                    return {
                      key: segmentArray[0].value,
                      matcher: segmentArray[1].value,
                      value: segmentArray[2].value,
                    };
                  })
                  .value();
                target.clientSideFilters = clientFilters;
                // update server filters
                var serverFilters = lodash__WEBPACK_IMPORTED_MODULE_2___default()(
                  _this.serverFilterSegments
                )
                  .filter(function(segmentArray) {
                    return segmentArray.length === 4;
                  })
                  .filter(function(segmentArray) {
                    return !segmentArray[1].fake && !segmentArray[3].fake;
                  })
                  .map(function(segmentArray) {
                    var type;
                    switch (segmentArray[0].value) {
                      case 'fieldSelector':
                        type =
                          _types__WEBPACK_IMPORTED_MODULE_3__['ServerSideFilterType']
                            .FIELD;
                        break;
                      case 'labelSelector':
                        type =
                          _types__WEBPACK_IMPORTED_MODULE_3__['ServerSideFilterType']
                            .LABEL;
                        break;
                      default:
                        return {};
                    }
                    return {
                      key: segmentArray[1].value,
                      matcher: segmentArray[2].value,
                      value: segmentArray[3].value,
                      type: type,
                    };
                  })
                  .filter(function(filter) {
                    return filter.type !== undefined;
                  })
                  .value();
                target.serverSideFilters = serverFilters;
              };
              /**
               * Returns all existing keys of the current data preview.
               */
              _this.getAllDeepKeys = function() {
                return lodash__WEBPACK_IMPORTED_MODULE_2___default.a.flatMap(
                  _this.combineKeys(_this.dataPreview[0]),
                  function(e) {
                    return e;
                  }
                );
              };
              /**
               * Returns selectable options for the field segments.
               */
              _this.getFieldSelectorOptions = function(segment, parentIndex, index) {
                var segments = [];
                if (_this.dataPreview && _this.dataPreview.length > 0) {
                  var options = [];
                  var currentSelection = _this.dataPreview[0];
                  if (index > 0) {
                    for (var i = 0; i < index; i++) {
                      var fieldSegment =
                        _this.target.fieldSelectors[parentIndex].fieldSegments[i];
                      currentSelection = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.get(
                        currentSelection,
                        fieldSegment.value
                      );
                    }
                  }
                  options = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.concat(
                    options,
                    ['*']
                  );
                  options = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.concat(
                    options,
                    Object.keys(currentSelection)
                  );
                  options.sort();
                  segments = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.map(
                    options,
                    function(option) {
                      return _this.uiSegmentSrv.newSegment({value: option});
                    }
                  );
                }
                return _this.$q.when(segments);
              };
              /**
               * Called if a field segment is changed.
               */
              _this.onFieldSelectorSegmentUpdate = function(segment, parentIndex) {
                if (segment == _this.addFieldSegment) {
                  _this.target.fieldSelectors.push(
                    new _FieldSelector__WEBPACK_IMPORTED_MODULE_4__['default'](
                      _this,
                      segment.value
                    )
                  );
                  _this.addFieldSegment = _this.uiSegmentSrv.newPlusButton();
                } else {
                  _this.target.fieldSelectors[parentIndex].refresh(_this);
                }
                _this.panelCtrl.refresh();
              };
              /**
               * Removes the field selector on the specified index.
               */
              _this.removeField = function(index) {
                _this.target.fieldSelectors.splice(index, 1);
                _this.panelCtrl.refresh();
              };
              /**
               * Called if an alias is changing.
               */
              _this.onAliasChange = function() {
                _this.panelCtrl.refresh();
              };
              _this.combineKeys = function(object) {
                var keys = Object.keys(object);
                return lodash__WEBPACK_IMPORTED_MODULE_2___default.a.flatMap(
                  keys,
                  function(key) {
                    if (
                      lodash__WEBPACK_IMPORTED_MODULE_2___default.a.isPlainObject(
                        object[key]
                      )
                    ) {
                      return lodash__WEBPACK_IMPORTED_MODULE_2___default.a.map(
                        _this.combineKeys(object[key]),
                        function(nestedKeys) {
                          return key + '.' + nestedKeys;
                        }
                      );
                    } else {
                      return key;
                    }
                  }
                );
              };
              /**
               * Returns the currently selected api endpoint.
               */
              _this._getCurrentApi = function() {
                return lodash__WEBPACK_IMPORTED_MODULE_2___default.a.find(
                  _constants__WEBPACK_IMPORTED_MODULE_5__['API_ENDPOINTS'],
                  {value: _this.target.apiEndpoints}
                );
              };
              _this.getServerFilterOptions = function(segment, parentIndex) {
                if (segment.type === 'operator') {
                  return _this.$q.when(
                    _this.uiSegmentSrv.newOperators([
                      '==',
                      '!=',
                      'in',
                      'notin',
                      'matches',
                    ])
                  );
                } else if (
                  segment.type === 'plus-button' ||
                  segment.type === 'condition'
                ) {
                  return _this.$q.when(
                    lodash__WEBPACK_IMPORTED_MODULE_2___default.a.map(
                      ['fieldSelector', 'labelSelector'],
                      function(value) {
                        return _this.uiSegmentSrv.newSegment({value: value});
                      }
                    )
                  );
                }
                var options = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.map(
                  _this.templateSrv.variables,
                  function(variable) {
                    return '"$' + variable.name + '"';
                  }
                );
                var filterType = _this.serverFilterSegments[parentIndex][0].value;
                if (filterType === 'fieldSelector') {
                  var currentApi = _this._getCurrentApi();
                  if (currentApi) {
                    currentApi.fieldSelectors.forEach(function(field) {
                      return options.push(field);
                    });
                  }
                }
                var segments = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.map(
                  options,
                  function(option) {
                    return _this.uiSegmentSrv.newSegment(new String(option));
                  }
                );
                return _this.$q.when(segments);
              };
              _this.onDataReceived = function() {
                if (_this.dataPreviewBuffer.length > 0) {
                  // this is done so that we get the response from all querys. otherwise the last query could override the
                  // data which we need
                  //
                  // TODO only store the data related to the current query
                  _this.dataPreview = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.flatten(
                    _this.dataPreviewBuffer
                  );
                  _this.dataPreviewBuffer = [];
                }
              };
              /**
               * Called when a request is finished. The requests data is stored and used as a data preview which is basis for auto completions.
               */
              _this.onResponseReceived = function(response) {
                if (!response.config.url.endsWith('/auth')) {
                  _this.dataPreviewBuffer.push(response.data);
                }
              };
              _this.onRefresh = function() {
                //TODO
                _this.dataPreview = {};
              };
              // Migrate existing configurations to the latest model version
              _utils_config_migration_util__WEBPACK_IMPORTED_MODULE_8__[
                'default'
              ].migrate(_this.target);
              var _a = _this.target,
                clientSideFilters = _a.clientSideFilters,
                serverSideFilters = _a.serverSideFilters;
              // restore client filter segments
              lodash__WEBPACK_IMPORTED_MODULE_2___default()(clientSideFilters)
                .map(_this._createClientFilterSegments)
                .each(function(segmentArray) {
                  return _this.clientFilterSegments.push(segmentArray);
                });
              _this.clientFilterSegments.push([_this.uiSegmentSrv.newPlusButton()]);
              //restore server filter segments
              lodash__WEBPACK_IMPORTED_MODULE_2___default()(serverSideFilters)
                .map(_this._createServerFilterSegments)
                .each(function(segmentArray) {
                  return _this.serverFilterSegments.push(segmentArray);
                });
              _this.serverFilterSegments.push([_this.uiSegmentSrv.newPlusButton()]);
              // create field selectors
              if (_this.target.fieldSelectors === undefined) {
                _this.target.fieldSelectors = [
                  new _FieldSelector__WEBPACK_IMPORTED_MODULE_4__['default'](_this, '*'),
                ];
              } else {
                _this.target.fieldSelectors = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.map(
                  _this.target.fieldSelectors,
                  function(selector) {
                    return _FieldSelector__WEBPACK_IMPORTED_MODULE_4__['default'].restore(
                      _this,
                      selector
                    );
                  }
                );
              }
              if (_this.target.apiEndpoints === undefined) {
                _this.target.apiEndpoints =
                  _constants__WEBPACK_IMPORTED_MODULE_5__['API_ENDPOINTS'][0].value;
              }
              if (_this.target.queryType === undefined) {
                _this.target.queryType = _this.queryTypes[0].value;
              }
              if (_this.target.format === undefined) {
                _this.target.format = _this.formats[0].value;
              }
              _this.addFieldSegment = _this.uiSegmentSrv.newPlusButton();
              if (_this.target.aggregation !== undefined) {
                delete _this.target.aggregation;
              }
              if (_this.target.aggregationType === undefined) {
                _this.target.aggregationType =
                  _constants__WEBPACK_IMPORTED_MODULE_5__['AGGREGATION_TYPES'][0].value;
              }
              if (_this.target.aggregationRequiresTarget === undefined) {
                _this.target.aggregationRequiresTarget =
                  _constants__WEBPACK_IMPORTED_MODULE_5__[
                    'AGGREGATION_TYPES'
                  ][0].requiresTarget;
              }
              if (_this.target.aggregationField === undefined) {
                _this.segmentAggregationTarget = _this.uiSegmentSrv.newFake(
                  'select target attribute',
                  'value',
                  'query-segment-value'
                );
              } else {
                _this.segmentAggregationTarget = _this.uiSegmentSrv.newSegment({
                  value: _this.target.aggregationField,
                });
              }
              if (_this.target.groupBy === undefined) {
                _this.groupBySegment = _this.uiSegmentSrv.newPlusButton();
              } else {
                _this.groupBySegment = _this.uiSegmentSrv.newSegment({
                  value: _this.target.groupBy,
                });
              }
              if (_this.target.namespace === undefined) {
                _this.target.namespace = 'default';
              }
              _this.namespaceSegment = _this.uiSegmentSrv.newSegment({
                value: _this.target.namespace,
              });
              grafana_app_core_app_events__WEBPACK_IMPORTED_MODULE_0___default.a.on(
                'ds-request-response',
                _this.onResponseReceived,
                $scope
              );
              _this.panelCtrl.events.on('refresh', _this.onRefresh, $scope);
              _this.panelCtrl.events.on('data-received', _this.onDataReceived, $scope);
              _this.panelCtrl.refresh();
              return _this;
            }
            /**
             * Returns a string representation of the current query configuration.
             */
            SensuQueryCtrl.prototype.getCollapsedText = function() {
              return Object(
                _utils_query_util__WEBPACK_IMPORTED_MODULE_6__['targetToQueryString']
              )(this.target);
            };
            SensuQueryCtrl.templateUrl = 'partials/query.editor.html';
            return SensuQueryCtrl;
          })(grafana_app_plugins_sdk__WEBPACK_IMPORTED_MODULE_1__['QueryCtrl']);

          /***/
        },

      /***/ './sensu/sensu.ts':
        /*!************************!*\
  !*** ./sensu/sensu.ts ***!
  \************************/
        /*! exports provided: default */
        /***/ function(module, __webpack_exports__, __webpack_require__) {
          'use strict';
          __webpack_require__.r(__webpack_exports__);
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
            /*! lodash */ 'lodash'
          );
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
            lodash__WEBPACK_IMPORTED_MODULE_0__
          );
          /* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
            /*! ../types */ './types.ts'
          );

          /**
           * Class which encapsulates the query mechanism against the Sensu Go API.
           */
          var Sensu = /** @class */ (function() {
            function Sensu() {}
            /**
             * Executes a query against the given datasource. An access token will be gathered if needed.
             * For each namespace specified in the passed options, a separate query will be executed.
             *
             * @param datasource the datasource to use
             * @param options the options specifying the query's request
             */
            Sensu.query = function(datasource, options) {
              var _this = this;
              var namespaces = options.namespaces;
              if (
                lodash__WEBPACK_IMPORTED_MODULE_0___default.a.isEmpty(namespaces) &&
                options.url === '/namespaces'
              ) {
                namespaces.push(''); // dummy element to execute a query
              }
              var queries = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.map(
                namespaces,
                function(namespace) {
                  return _this._doQuery(datasource, options, namespace);
                }
              );
              return Promise.all(queries).then(function(data) {
                return lodash__WEBPACK_IMPORTED_MODULE_0___default.a.flatten(data);
              });
            };
            /**
             * Executes a query against the given datasource. An access token will be gathered if needed.
             *
             * @param datasource the datasource to use
             * @param options the options specifying the query's request
             * @param namespace the namespace used by this query
             */
            Sensu._doQuery = function(datasource, options, namespace, retryCount) {
              var _this = this;
              if (retryCount === void 0) {
                retryCount = 0;
              }
              var method = options.method,
                url = options.url;
              var fullUrl;
              if (url === '/namespaces') {
                fullUrl = Sensu.apiBaseUrl + '/namespaces';
              } else {
                var namespacePath = namespace === '*' ? '' : '/namespaces/' + namespace;
                fullUrl = Sensu.apiBaseUrl + namespacePath + url;
              }
              var requestParameters = this._getParameters(options);
              return Sensu._authenticate(datasource)
                .then(function() {
                  return Sensu._request(datasource, method, fullUrl, requestParameters);
                })
                .then(function(result) {
                  return result.data;
                })
                .catch(function(error) {
                  // we'll retry once
                  if (retryCount >= 1) {
                    throw error;
                  }
                  // delete token details in order to refresh the token in case of basic auth
                  delete datasource.instanceSettings.tokens;
                  // the retry is not immediatly done in order to prevent some race conditions
                  var delay = Math.floor(1000 + Math.random() * 1000);
                  return new Promise(function(resolve) {
                    return setTimeout(resolve, delay);
                  }).then(function() {
                    return _this._doQuery(datasource, options, namespace, retryCount + 1);
                  });
                });
            };
            /**
             * Checks whether an access token exist. If none exists or it is expired a new one will be fetched.
             * In case an api key auth is used, this method will never fetch a token.
             *
             * @param datasource the datasource to use
             */
            Sensu._authenticate = function(datasource) {
              var tokens = datasource.instanceSettings.tokens;
              var useApiKey = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.get(
                datasource.instanceSettings,
                'jsonData.useApiKey',
                false
              );
              // never aquire token in case of api key auth
              if (useApiKey) {
                return Promise.resolve(true);
              }
              var acquireToken = !tokens || Sensu._isTokenExpired(tokens);
              if (acquireToken) {
                return Sensu._acquireAccessToken(datasource);
              } else {
                return Promise.resolve(true);
              }
            };
            /**
             * Returns whether the given token is already expired.
             *
             * @param token the token to check
             */
            Sensu._isTokenExpired = function(token) {
              var timestampNow = Math.floor(Date.now() / 1000);
              var expiresAt = token.expires_at;
              if (token.expires_offset) {
                expiresAt = expiresAt - token.expires_offset - Sensu.tokenExpireOffset_s;
              }
              return expiresAt < timestampNow;
            };
            /**
             * Fetches and stores an access token.
             *
             * @param datasource the datasource to use
             */
            Sensu._acquireAccessToken = function(datasource) {
              return Sensu._request(datasource, 'GET', '/auth').then(function(result) {
                var tokens = result.data;
                var timestampNow = Math.floor(Date.now() / 1000);
                var expiresOffset =
                  tokens.expires_at - timestampNow - Sensu.tokenTimeout_s;
                tokens.expires_offset = expiresOffset;
                datasource.instanceSettings.tokens = tokens;
              });
            };
            /**
             * Executes a (potential authenticated) request against the specified url using the given datasource (server) and HTTP method.
             *
             * @param datasource the datasource to use
             * @param method the method of the HTTP request (GET, POST, ...)
             * @param url the url to send the request to
             */
            Sensu._request = function(datasource, method, url, requestParameters) {
              if (requestParameters === void 0) {
                requestParameters = {};
              }
              var useApiKey = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.get(
                datasource.instanceSettings,
                'jsonData.useApiKey',
                false
              );
              var req = {
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
                if (
                  lodash__WEBPACK_IMPORTED_MODULE_0___default.a.has(
                    datasource.instanceSettings,
                    'tokens'
                  )
                ) {
                  req.headers.Authorization =
                    'Bearer ' + datasource.instanceSettings.tokens.access_token;
                }
              }
              req.params = requestParameters;
              return datasource.backendSrv
                .datasourceRequest(req)
                .then(Sensu._handleRequestResult, Sensu._handleRequestError);
            };
            /**
             * Is called when the request is ending successfully. In case of a 401 error, the request is not throwing an error but returning no result object.
             *
             * @param result the request's result object
             */
            Sensu._handleRequestResult = function(result) {
              if (result) {
                return result;
              } else {
                throw {
                  message: 'Credentials Invalid: Could not logged in using credentials',
                  data: 'access_error',
                };
              }
            };
            /**
             * Is called if the request's promise is getting an error.
             *
             * @param err the request's error object
             */
            Sensu._handleRequestError = function(err) {
              if (err.status !== 0 || err.status >= 300) {
                if (err.data && err.data.message) {
                  throw {
                    message: 'Sensu Go Error: ' + err.data.message,
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
            };
            /**
             * Returns an object which represents the request parameters that should be used
             * by the request representing the data source query.
             *
             * @param options the query options to use as basis for the parameters
             */
            Sensu._getParameters = function(options) {
              var limit = options.limit,
                responseFilters = options.responseFilters;
              var result = {};
              // build the response filter parameters
              var fieldSelector = this._buildFilterParameter(
                responseFilters.filter(function(filter) {
                  return (
                    filter.type ===
                    _types__WEBPACK_IMPORTED_MODULE_1__['ServerSideFilterType'].FIELD
                  );
                })
              );
              if (fieldSelector !== '') {
                result.fieldSelector = fieldSelector;
              }
              var labelSelector = this._buildFilterParameter(
                responseFilters.filter(function(filter) {
                  return (
                    filter.type ===
                    _types__WEBPACK_IMPORTED_MODULE_1__['ServerSideFilterType'].LABEL
                  );
                })
              );
              if (labelSelector !== '') {
                result.labelSelector = labelSelector;
              }
              // build the limit option
              if (limit > 0) {
                result.limit = limit;
              }
              return result;
            };
            /**
             * Creates the parameter value for a response (server-side) filter. More details regarding its
             * format can be found in the documentation: https://docs.sensu.io/sensu-go/latest/api/#response-filtering
             *
             * @param filters the filters which will be included in the filter parameter
             */
            Sensu._buildFilterParameter = function(filters) {
              return lodash__WEBPACK_IMPORTED_MODULE_0___default()(filters)
                .map(function(filter) {
                  return filter.key + ' ' + filter.matcher + ' ' + filter.value;
                })
                .join(' && ');
            };
            /**
             * The max duration a token is valid in seconds.
             */
            Sensu.tokenTimeout_s = 600;
            /**
             * This duration will be susbtracted of the `tokenTimeout_s` duration.
             */
            Sensu.tokenExpireOffset_s = 60;
            /**
             * The API's base url.
             */
            Sensu.apiBaseUrl = '/api/core/v2';
            /**
             * The data source route used for API key authentication. See also the plugin.json file.
             */
            Sensu.apiKeyUrlPrefix = '/api_key_auth';
            return Sensu;
          })();
          /* harmony default export */ __webpack_exports__['default'] = Sensu;

          /***/
        },

      /***/ './transformer/index.ts':
        /*!******************************!*\
  !*** ./transformer/index.ts ***!
  \******************************/
        /*! exports provided: default */
        /***/ function(module, __webpack_exports__, __webpack_require__) {
          'use strict';
          __webpack_require__.r(__webpack_exports__);
          /* harmony import */ var _table_transformer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
            /*! ./table_transformer */ './transformer/table_transformer.ts'
          );
          /* harmony import */ var _timeseries_transformer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
            /*! ./timeseries_transformer */ './transformer/timeseries_transformer.ts'
          );

          /* harmony default export */ __webpack_exports__['default'] = {
            toTable: function(dataMatrix, vertical) {
              return Object(_table_transformer__WEBPACK_IMPORTED_MODULE_0__['default'])(
                dataMatrix,
                vertical
              );
            },
            toTimeSeries: function(dataMatrix) {
              return Object(
                _timeseries_transformer__WEBPACK_IMPORTED_MODULE_1__['default']
              )(dataMatrix);
            },
          };

          /***/
        },

      /***/ './transformer/table_transformer.ts':
        /*!******************************************!*\
  !*** ./transformer/table_transformer.ts ***!
  \******************************************/
        /*! exports provided: default */
        /***/ function(module, __webpack_exports__, __webpack_require__) {
          'use strict';
          __webpack_require__.r(__webpack_exports__);
          /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
            /*! ../constants */ './constants.ts'
          );
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
            /*! lodash */ 'lodash'
          );
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
            lodash__WEBPACK_IMPORTED_MODULE_1__
          );
          /* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
            /*! moment */ 'moment'
          );
          /* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
            moment__WEBPACK_IMPORTED_MODULE_2__
          );

          /**
           * Transforms the given data into a table representation.
           */
          var transform = function(dataMatrix, vertical) {
            var columns = _extractColumns(dataMatrix);
            // create column index mapping
            var columnIndexMap = {};
            lodash__WEBPACK_IMPORTED_MODULE_1___default.a.each(columns, function(
              column,
              index
            ) {
              return (columnIndexMap[column.text] = index);
            });
            // generate data rows
            var rows = lodash__WEBPACK_IMPORTED_MODULE_1___default.a.map(
              dataMatrix,
              function(dataRow) {
                var row = lodash__WEBPACK_IMPORTED_MODULE_1___default.a.times(
                  columns.length,
                  lodash__WEBPACK_IMPORTED_MODULE_1___default.a.constant(null)
                );
                lodash__WEBPACK_IMPORTED_MODULE_1___default()(dataRow)
                  .map(function(_a) {
                    var name = _a.name,
                      value = _a.value;
                    if (lodash__WEBPACK_IMPORTED_MODULE_1___default.a.isArray(value)) {
                      return lodash__WEBPACK_IMPORTED_MODULE_1___default.a.map(
                        value,
                        function(element, index) {
                          return [name + '[' + index + ']', element];
                        }
                      );
                    } else {
                      return [[name, value]];
                    }
                  })
                  .flatten()
                  .map(function(data) {
                    if (
                      lodash__WEBPACK_IMPORTED_MODULE_1___default.a.isPlainObject(
                        data[1]
                      ) ||
                      lodash__WEBPACK_IMPORTED_MODULE_1___default.a.isArray(data[1])
                    ) {
                      data[1] = JSON.stringify(data[1]);
                    }
                    return data;
                  })
                  .each(function(_a) {
                    var columnName = _a[0],
                      value = _a[1];
                    row[columnIndexMap[columnName]] = value;
                  });
                return row;
              }
            );
            if (vertical) {
              return _asVerticalTable(columns, rows);
            }
            // create grafana result object
            return {
              columns: columns,
              rows: rows,
              type: 'table',
            };
          };
          var _asVerticalTable = function(dataColumns, dataRows) {
            // fixed table headers
            var columns = [
              {
                text: 'Attribute',
              },
              {
                text: 'Value',
              },
            ];
            var rows = lodash__WEBPACK_IMPORTED_MODULE_1___default()(dataRows)
              .flatten()
              .map(function(value, idx) {
                return [dataColumns[idx].text, value];
              })
              .value();
            // this is done because users cannot define a time formatting based on rows
            _convertTimestamps(rows);
            return {
              columns: columns,
              rows: rows,
              type: 'table',
            };
          };
          var _convertTimestamps = function(rows) {
            lodash__WEBPACK_IMPORTED_MODULE_1___default.a.each(rows, function(row) {
              var attribute = row[0];
              var value = row[1];
              for (
                var index = 0;
                index < _constants__WEBPACK_IMPORTED_MODULE_0__['TIME_PROPERTIES'].length;
                index++
              ) {
                if (
                  attribute ===
                  _constants__WEBPACK_IMPORTED_MODULE_0__['TIME_PROPERTIES'][index]
                ) {
                  var time = lodash__WEBPACK_IMPORTED_MODULE_1___default.a.defaultTo(
                    value,
                    -1
                  );
                  if (time > 0) {
                    row[1] = moment__WEBPACK_IMPORTED_MODULE_2___default()(time).format(
                      'YYYY-MM-DD HH:mm:ss'
                    );
                  }
                  break;
                }
              }
            });
          };
          /**
           * Returns an array of columns which exist in the given data matrix. Each data point attribute will be
           * represents by a column.
           *
           * @param dataMatrix the data basis
           */
          var _extractColumns = function(dataMatrix) {
            var isArrayMarker = {};
            // extract existing columns
            return lodash__WEBPACK_IMPORTED_MODULE_1___default()(dataMatrix)
              .flatten()
              .map(function(_a) {
                var name = _a.name,
                  value = _a.value;
                if (lodash__WEBPACK_IMPORTED_MODULE_1___default.a.isArray(value)) {
                  isArrayMarker[name] = true;
                  return lodash__WEBPACK_IMPORTED_MODULE_1___default.a.times(
                    value.length,
                    function(index) {
                      return name + '[' + index + ']';
                    }
                  );
                } else {
                  if (
                    lodash__WEBPACK_IMPORTED_MODULE_1___default.a.isNil(value) &&
                    lodash__WEBPACK_IMPORTED_MODULE_1___default.a.get(
                      isArrayMarker,
                      name,
                      false
                    )
                  ) {
                    return [];
                  }
                  return [name];
                }
              })
              .flatten()
              .uniq()
              .map(function(name) {
                return {
                  text: name,
                };
              })
              .value();
          };
          /* harmony default export */ __webpack_exports__['default'] = transform;

          /***/
        },

      /***/ './transformer/timeseries_transformer.ts':
        /*!***********************************************!*\
  !*** ./transformer/timeseries_transformer.ts ***!
  \***********************************************/
        /*! exports provided: default */
        /***/ function(module, __webpack_exports__, __webpack_require__) {
          'use strict';
          __webpack_require__.r(__webpack_exports__);
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
            /*! lodash */ 'lodash'
          );
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
            lodash__WEBPACK_IMPORTED_MODULE_0__
          );

          /**
           * Transforms the given data into a time series representation.
           */
          var transform = function(dataMatrix) {
            var now = Date.now();
            // maps the data to a series - skips all values which are not finite
            // - name => series name
            // - value => value
            return lodash__WEBPACK_IMPORTED_MODULE_0___default()(dataMatrix)
              .flatten()
              .filter(function(data) {
                return lodash__WEBPACK_IMPORTED_MODULE_0___default.a.isFinite(data.value);
              })
              .map(function(data) {
                return {
                  target: data.name,
                  datapoints: [[data.value, now]],
                };
              })
              .value();
          };
          /* harmony default export */ __webpack_exports__['default'] = transform;

          /***/
        },

      /***/ './types.ts':
        /*!******************!*\
  !*** ./types.ts ***!
  \******************/
        /*! exports provided: ServerSideFilterType */
        /***/ function(module, __webpack_exports__, __webpack_require__) {
          'use strict';
          __webpack_require__.r(__webpack_exports__);
          /* harmony export (binding) */ __webpack_require__.d(
            __webpack_exports__,
            'ServerSideFilterType',
            function() {
              return ServerSideFilterType;
            }
          );
          var ServerSideFilterType;
          (function(ServerSideFilterType) {
            ServerSideFilterType[(ServerSideFilterType['FIELD'] = 0)] = 'FIELD';
            ServerSideFilterType[(ServerSideFilterType['LABEL'] = 1)] = 'LABEL';
          })(ServerSideFilterType || (ServerSideFilterType = {}));

          /***/
        },

      /***/ './utils/config_migration_util.ts':
        /*!****************************************!*\
  !*** ./utils/config_migration_util.ts ***!
  \****************************************/
        /*! exports provided: default */
        /***/ function(module, __webpack_exports__, __webpack_require__) {
          'use strict';
          __webpack_require__.r(__webpack_exports__);
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
            /*! lodash */ 'lodash'
          );
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
            lodash__WEBPACK_IMPORTED_MODULE_0__
          );

          /** The latest configuration version. */
          var LATEST_VERSION = 2;
          /** Migrates the passed configuration target to the latest version. The passed object will be mutated. */
          var migrate = function(target) {
            var version = target.version;
            if (version === undefined) {
              init(target);
            }
            if (version === 1) {
              toVersion2(target);
            }
            return target;
          };
          /** Initializes the configuration target. */
          var init = function(target) {
            target.version = LATEST_VERSION;
            target.clientSideFilters = [];
            target.serverSideFilters = [];
          };
          /** Migrates the passed configuration target from version 1 to version 2. */
          var toVersion2 = function(target) {
            console.log('Migrating data source configuration to version 2.');
            var filterSegments = target.filterSegments;
            var filters = lodash__WEBPACK_IMPORTED_MODULE_0___default()(filterSegments)
              .filter(function(segments) {
                return segments.length === 3;
              })
              .filter(function(segments) {
                return !lodash__WEBPACK_IMPORTED_MODULE_0___default.a.get(
                  segments[2],
                  'fake',
                  false
                );
              })
              .map(function(segments) {
                var matcher = segments[1].value === '=' ? '==' : segments[1].value;
                return {
                  key: segments[0].value,
                  matcher: matcher,
                  value: segments[2].value,
                };
              })
              .value();
            delete target.filterSegments;
            target.clientSideFilters = filters;
            target.serverSideFilters = [];
            target.version = 2;
          };
          /* harmony default export */ __webpack_exports__['default'] = {
            migrate: migrate,
          };

          /***/
        },

      /***/ './utils/data_aggregation_util.ts':
        /*!****************************************!*\
  !*** ./utils/data_aggregation_util.ts ***!
  \****************************************/
        /*! exports provided: default */
        /***/ function(module, __webpack_exports__, __webpack_require__) {
          'use strict';
          __webpack_require__.r(__webpack_exports__);
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
            /*! lodash */ 'lodash'
          );
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
            lodash__WEBPACK_IMPORTED_MODULE_0__
          );

          /**
           * Does a count aggregation. The number of elements in the given data is returned.
           *
           * @param data the data to aggregate
           * @param name  the name of the resulting value
           */
          var count = function(data, name) {
            return [
              {
                name: name,
                value: data.length,
              },
            ];
          };
          /**
           * Does a sum aggregation. The sum of the specified attribute of all elements in the given data is calculated.
           *
           * @param data  the data to aggregate
           * @param name the name of the resulting value
           * @param targetField  the field which should be summed up
           */
          var sum = function(data, name, targetField) {
            if (!targetField) {
              return [];
            }
            var sum = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.sumBy(
              data,
              targetField
            );
            if (!lodash__WEBPACK_IMPORTED_MODULE_0___default.a.isFinite(sum)) {
              sum = null;
            }
            return [
              {
                name: name,
                value: sum,
              },
            ];
          };
          /* harmony default export */ __webpack_exports__['default'] = {
            count: count,
            sum: sum,
          };

          /***/
        },

      /***/ './utils/datasource_filter_util.ts':
        /*!*****************************************!*\
  !*** ./utils/datasource_filter_util.ts ***!
  \*****************************************/
        /*! exports provided: matchs, default */
        /***/ function(module, __webpack_exports__, __webpack_require__) {
          'use strict';
          __webpack_require__.r(__webpack_exports__);
          /* harmony export (binding) */ __webpack_require__.d(
            __webpack_exports__,
            'matchs',
            function() {
              return matchs;
            }
          );
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
            /*! lodash */ 'lodash'
          );
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
            lodash__WEBPACK_IMPORTED_MODULE_0__
          );

          /**
           * Returns whether the given data value matchs the filter specified by the filter value in combination with the given operator.
           * @param filterValue the filter value
           * @param operator the operator used for comparision
           * @param dataValue the data value to test
           */
          var matchs = function(filterValue, operator, dataValue) {
            if (operator === '==') {
              return filterValue == dataValue;
            }
            if (operator === '!=') {
              return filterValue != dataValue;
            }
            if (operator === '=~' || operator === '!~') {
              return _matchRegExp(filterValue, operator, dataValue);
            }
            if (operator === '<' || operator === '>') {
              return _matchNumber(filterValue, operator, dataValue);
            }
            throw 'Unsupported operator "' + operator + '"';
          };
          /**
           * Matching using '>' and '<' operators.
           */
          var _matchNumber = function(filterValue, operator, dataValue) {
            var filterNumber = Number(filterValue);
            if (!lodash__WEBPACK_IMPORTED_MODULE_0___default.a.isFinite(filterNumber)) {
              console.warn(
                'The specified filter value (' +
                  filterValue +
                  ') is not compatible to filter on a numeric attribute.'
              );
              return false;
            }
            if (operator === '<') {
              return dataValue < filterNumber;
            } else {
              return dataValue > filterNumber;
            }
          };
          /**
           * Matching using regular expressions.
           */
          var _matchRegExp = function(filterValue, operator, dataValue) {
            var regex = _stringToRegex(filterValue);
            if (operator === '=~') {
              return regex.test(dataValue);
            } else {
              return !regex.test(dataValue);
            }
          };
          /**
           * Converts a string to a RegExp instance and keeps optional modifiers.
           * @param value the string to convert
           */
          var _stringToRegex = function(value) {
            var regex = value.match(/\/(.*)\/(\w*)/);
            if (regex) {
              return new RegExp(regex[1], regex[2]);
            } else {
              return new RegExp(value);
            }
          };
          /* harmony default export */ __webpack_exports__['default'] = {matchs: matchs};

          /***/
        },

      /***/ './utils/query_util.ts':
        /*!*****************************!*\
  !*** ./utils/query_util.ts ***!
  \*****************************/
        /*! exports provided: targetToQueryString, extractQueryComponents, default */
        /***/ function(module, __webpack_exports__, __webpack_require__) {
          'use strict';
          __webpack_require__.r(__webpack_exports__);
          /* harmony export (binding) */ __webpack_require__.d(
            __webpack_exports__,
            'targetToQueryString',
            function() {
              return targetToQueryString;
            }
          );
          /* harmony export (binding) */ __webpack_require__.d(
            __webpack_exports__,
            'extractQueryComponents',
            function() {
              return extractQueryComponents;
            }
          );
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
            /*! lodash */ 'lodash'
          );
          /* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
            lodash__WEBPACK_IMPORTED_MODULE_0__
          );
          /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
            /*! ../constants */ './constants.ts'
          );
          /* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
            /*! ../types */ './types.ts'
          );

          /** RegEx matching a in-browser filter of the WHERE-clause. */
          var CLIENT_FILTER_REG_EXP = '([^\\s:=!]+)\\s*(==|=~|!=|>|<|!~|=)\\s*(\\S+)';
          /** RegExp of a filter key or value of the server-side filter. */
          var SERVER_FILTER_VALUE_REG_EXP = '\\[[^[]+\\]|"[^"]+"|\\S+';
          /** RegEx matching a response filter (server-side) of the WHERE-clause. */
          var SERVER_FILTER_REG_EXP =
            '(fieldSelector|labelSelector):(' +
            SERVER_FILTER_VALUE_REG_EXP +
            ')\\s*(==|!=|IN|NOTIN|MATCHES)\\s*(' +
            SERVER_FILTER_VALUE_REG_EXP +
            ')';
          /** RegEx representing a single element of the WHERE-clause. */
          var QUERY_SINGLE_FILTER_REG_EXP =
            '(' + SERVER_FILTER_REG_EXP + '|' + CLIENT_FILTER_REG_EXP + ')';
          /** RegEx representing the whole query string. */
          var QUERY_FULL_REG_EXP =
            '^\\s*QUERY\\s+API\\s+(entity|events|namespaces)\\s+(IN\\s+NAMESPACE\\s+(\\S+)\\s+)?SELECT\\s+(\\S+)(\\s+WHERE\\s+(' +
            QUERY_SINGLE_FILTER_REG_EXP +
            '(\\s+AND\\s+' +
            QUERY_SINGLE_FILTER_REG_EXP +
            ')*))?(\\s+LIMIT\\s+(\\d+))?\\s*$';
          /**
           * Creates a query string based on the target definition.
           * @param target the data used by the query
           */
          function targetToQueryString(target) {
            var query = 'QUERY API ' + target.apiEndpoints;
            query += _namespace(target);
            if (target.queryType === 'field') {
              query += _queryTypeField(target);
            } else if (target.queryType === 'aggregation') {
              query += _queryTypeAggregation(target);
            }
            query += _whereClause(target);
            query += _limit(target);
            return query;
          }
          /**
           * Return the "select" statement based on the given target.
           * E.g.: SELECT field, another.field AS myField
           */
          var _queryTypeField = function(target) {
            var fields = lodash__WEBPACK_IMPORTED_MODULE_0___default()(
              target.fieldSelectors
            )
              .flatMap(function(selector) {
                if (selector.alias) {
                  return selector.getPath() + ' AS ' + selector.alias;
                } else {
                  return selector.getPath();
                }
              })
              .join(', ');
            return ' SELECT ' + fields;
          };
          /**
           * Return the "aggregation" statement based on the given target.
           * E.g.:  AGGREGATE sum ON field
           */
          var _queryTypeAggregation = function(target) {
            var query = ' AGGREGATE ' + target.aggregationType;
            if (target.aggregationRequiresTarget) {
              query += ' ON ' + target.aggregationField;
            }
            return query;
          };
          /**
           * Return the namespace statement based on the given target.
           * E.g.:  IN NAMESPACE default
           */
          var _namespace = function(target) {
            if (target.namespace === 'default') {
              return '';
            } else {
              return ' IN NAMESPACE ' + target.namespace;
            }
          };
          /**
           * Return the where clause based on the given target.
           * E.g.: WHERE field=value AND status>0
           */
          var _whereClause = function(target) {
            var clientSideFilters = target.clientSideFilters,
              serverSideFilters = target.serverSideFilters;
            var serverFilters = lodash__WEBPACK_IMPORTED_MODULE_0___default()(
              serverSideFilters
            )
              .map(function(filter) {
                return (
                  (filter.type ==
                  _types__WEBPACK_IMPORTED_MODULE_2__['ServerSideFilterType'].FIELD
                    ? 'fieldSelector'
                    : 'labelSelector') +
                  ':' +
                  filter.key +
                  ' ' +
                  filter.matcher.toUpperCase() +
                  ' ' +
                  filter.value
                );
              })
              .value();
            var clientFilters = lodash__WEBPACK_IMPORTED_MODULE_0___default()(
              clientSideFilters
            )
              .map(function(filter) {
                return filter.key + ' ' + filter.matcher + ' ' + filter.value;
              })
              .value();
            var whereClause = lodash__WEBPACK_IMPORTED_MODULE_0___default()([
              serverFilters,
              clientFilters,
            ])
              .flatten()
              .join(' AND ');
            if (whereClause) {
              return ' WHERE ' + whereClause;
            } else {
              return '';
            }
          };
          /**
           * Return the limit statement based on the given target. If no limit is specified the default limit will be used.
           * E.g.: LIMIT 100
           */
          var _limit = function(target) {
            var queryLimit;
            if (target.limit) {
              queryLimit = lodash__WEBPACK_IMPORTED_MODULE_0___default.a.defaultTo(
                parseInt(target.limit),
                _constants__WEBPACK_IMPORTED_MODULE_1__['DEFAULT_LIMIT']
              );
            } else {
              // Use a special default limit in aggregation queries
              if (target.queryType === 'aggregation') {
                queryLimit =
                  _constants__WEBPACK_IMPORTED_MODULE_1__['DEFAULT_AGGREGATION_LIMIT'];
              } else {
                queryLimit = _constants__WEBPACK_IMPORTED_MODULE_1__['DEFAULT_LIMIT'];
              }
            }
            if (queryLimit > 0) {
              return ' LIMIT ' + queryLimit;
            } else {
              return '';
            }
          };
          var extractQueryComponents = function(query) {
            var queryRegExp = new RegExp(QUERY_FULL_REG_EXP, 'i');
            var matchResult = query.match(queryRegExp);
            if (!matchResult) {
              return null;
            }
            var namespace;
            if (matchResult[3] !== undefined) {
              namespace = matchResult[3];
            } else {
              namespace = 'default';
            }
            var components = {
              apiKey: matchResult[1],
              namespace: namespace,
              selectedField: matchResult[4],
              clientFilters: [],
              serverFilters: [],
              limit: parseInt(matchResult[25]),
            };
            if (matchResult[6] !== undefined) {
              var filterRegExp = new RegExp(
                SERVER_FILTER_REG_EXP + '|' + CLIENT_FILTER_REG_EXP,
                'gi'
              );
              var whereClause = matchResult[6];
              var match = void 0;
              while ((match = filterRegExp.exec(whereClause)) !== null) {
                var isServerFilter = match[1] !== undefined;
                if (isServerFilter) {
                  // add response filter
                  var filter = {
                    type:
                      match[1] === 'fieldSelector'
                        ? _types__WEBPACK_IMPORTED_MODULE_2__['ServerSideFilterType']
                            .FIELD
                        : _types__WEBPACK_IMPORTED_MODULE_2__['ServerSideFilterType']
                            .LABEL,
                    key: match[2],
                    matcher: match[3],
                    value: match[4],
                  };
                  components.serverFilters.push(filter);
                } else {
                  // add in-browser filter
                  var filter = {
                    key: match[5],
                    matcher: match[6] === '=' ? '==' : match[6],
                    value: match[7],
                  };
                  components.clientFilters.push(filter);
                }
              }
            }
            return components;
          };
          /* harmony default export */ __webpack_exports__['default'] = {
            targetToQueryString: targetToQueryString,
            extractQueryComponents: extractQueryComponents,
          };

          /***/
        },

      /***/ 'grafana/app/core/app_events':
        /*!**************************************!*\
  !*** external "app/core/app_events" ***!
  \**************************************/
        /*! no static exports found */
        /***/ function(module, exports) {
          module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_core_app_events__;

          /***/
        },

      /***/ 'grafana/app/plugins/sdk':
        /*!**********************************!*\
  !*** external "app/plugins/sdk" ***!
  \**********************************/
        /*! no static exports found */
        /***/ function(module, exports) {
          module.exports = __WEBPACK_EXTERNAL_MODULE_grafana_app_plugins_sdk__;

          /***/
        },

      /***/ lodash:
        /*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
        /*! no static exports found */
        /***/ function(module, exports) {
          module.exports = __WEBPACK_EXTERNAL_MODULE_lodash__;

          /***/
        },

      /***/ moment:
        /*!*************************!*\
  !*** external "moment" ***!
  \*************************/
        /*! no static exports found */
        /***/ function(module, exports) {
          module.exports = __WEBPACK_EXTERNAL_MODULE_moment__;

          /***/
        },

      /******/
    }
  );
});
//# sourceMappingURL=module.js.map
