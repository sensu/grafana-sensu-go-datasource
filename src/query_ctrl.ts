import appEvents from 'grafana/app/core/app_events';
import {QueryCtrl} from 'grafana/app/plugins/sdk';
import _ from 'lodash';

import {
  ApiEndpoint,
  AggregationType,
  TextValue,
  GrafanaTarget,
  ClientSideFilter,
} from './types';

import FieldSelector from './FieldSelector';
import {AGGREGATION_TYPES, API_ENDPOINTS, QUERY_TYPES, FORMATS} from './constants';
import {targetToQueryString} from './utils/query_util';
import Sensu from './sensu/sensu';
import ConfigMigration from './utils/config_migration_util';

export class SensuQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';

  // Constants
  readonly aggregationTypes: AggregationType[] = AGGREGATION_TYPES;
  readonly queryTypes: TextValue[] = QUERY_TYPES;
  readonly formats: TextValue[] = FORMATS;

  segmentAggregationTarget: any;
  dataPreview: any;

  apiEndpoints: ApiEndpoint[] = API_ENDPOINTS;
  addFieldSegment: any;
  filterSegments: any[] = [];
  namespaceSegment: any;

  /** @ngInject **/
  constructor($scope, $injector, private $q, public uiSegmentSrv, private templateSrv) {
    super($scope, $injector);

    // Migrate existing configurations to the latest model version
    ConfigMigration.migrate(this.target);

    const {clientSideFilters} = <GrafanaTarget>this.target;

    // restore filter segments
    _(clientSideFilters)
      .map(this._createClientFilterSegments)
      .each((segmentArray) => this.filterSegments.push(segmentArray));

    this.filterSegments.push([this.uiSegmentSrv.newPlusButton()]);

    // create field selectors
    if (this.target.fieldSelectors === undefined) {
      this.target.fieldSelectors = [new FieldSelector(this, '*')];
    } else {
      this.target.fieldSelectors = _.map(this.target.fieldSelectors, (selector) =>
        FieldSelector.restore(this, selector)
      );
    }

    if (this.target.apiEndpoints === undefined) {
      this.target.apiEndpoints = API_ENDPOINTS[0].value;
    }

    if (this.target.queryType === undefined) {
      this.target.queryType = this.queryTypes[0].value;
    }

    if (this.target.format === undefined) {
      this.target.format = this.formats[0].value;
    }

    this.addFieldSegment = this.uiSegmentSrv.newPlusButton();

    if (this.target.aggregation !== undefined) {
      delete this.target.aggregation;
    }

    if (this.target.aggregationType === undefined) {
      this.target.aggregationType = AGGREGATION_TYPES[0].value;
    }

    if (this.target.aggregationRequiresTarget === undefined) {
      this.target.aggregationRequiresTarget = AGGREGATION_TYPES[0].requiresTarget;
    }

    if (this.target.aggregationField === undefined) {
      this.segmentAggregationTarget = this.uiSegmentSrv.newFake(
        'select target attribute',
        'value',
        'query-segment-value'
      );
    } else {
      this.segmentAggregationTarget = this.uiSegmentSrv.newSegment({
        value: this.target.aggregationField,
      });
    }

    if (this.target.namespace === undefined) {
      this.target.namespace = 'default';
    }

    this.namespaceSegment = this.uiSegmentSrv.newSegment({value: this.target.namespace});

    appEvents.on('ds-request-response', this.onResponseReceived, $scope);
    this.panelCtrl.events.on('refresh', this.onRefresh, $scope);
    this.panelCtrl.events.on('data-received', this.onDataReceived, $scope);

    this.panelCtrl.refresh();
  }

  _createClientFilterSegments = (filter: ClientSideFilter) => {
    let segmentArray = [
      this.uiSegmentSrv.newKey(filter.key),
      this.uiSegmentSrv.newOperator(filter.matcher),
      this.uiSegmentSrv.newKeyValue(filter.value),
    ];

    return segmentArray;
  };

  /**
   * Returns the currently selected aggregation type.
   */
  getCurrentAggregationType = () => {
    return <AggregationType>_.find(AGGREGATION_TYPES, {
      value: this.target.aggregationType,
    });
  };

  /**
   * Called if the aggregation field changes.
   */
  onAggregationFieldChange = () => {
    this.target.aggregationField = this.segmentAggregationTarget.value;
    this.panelCtrl.refresh();
  };

  /**
   * Called if the aggregation type changes.
   */
  onAggregationTypeChange = () => {
    console.log('aggregation', this.target.aggregationType);
    this.target.aggregationRequiresTarget = this.getCurrentAggregationType().requiresTarget;
    this._resetAggregation();
    this.panelCtrl.refresh();
  };

  /**
   * Resets the aggregation options.
   */
  _resetAggregation = () => {
    delete this.target.aggregationAlias;
    delete this.target.aggregationField;

    this.segmentAggregationTarget = this.uiSegmentSrv.newFake(
      'select target attribute',
      'value',
      'query-segment-value'
    );
  };

  /**
   * Returns selectable options for the aggregation field segment.
   */
  getTargetOptions = () => {
    const options: string[] = this.getAllDeepKeys();
    const segments: any[] = _.map(options, (option) =>
      this.uiSegmentSrv.newSegment({value: option})
    );

    return this.$q.when(segments);
  };

  /**
   * Returns selectable options for the namespace segment.
   */
  getNamespaceOptions = () => {
    return Sensu.query(this.datasource, {
      method: 'GET',
      url: '/namespaces',
      namespaces: [],
      limit: 0,
    })
      .then((result) => {
        // get existing namespaces based on query result
        const namespaceArray = _.get(result, 'data', []);
        const namespaces = _.map(namespaceArray, (namespace) => namespace.name);

        // add all option
        namespaces.unshift('*');

        // add template variables
        _.each(this.templateSrv.variables, (variable) =>
          namespaces.unshift('$' + variable.name)
        );

        return _.map(namespaces, (option) =>
          this.uiSegmentSrv.newSegment({value: option})
        );
      })
      .catch(() => {
        return [];
      });
  };

  /**
   * Called of the namespace is changing.
   */
  onNamespaceChange = () => {
    this.target.namespace = this.namespaceSegment.value;
    this.panelCtrl.refresh();
  };

  /**
   * Resets the field and filter segments.
   */
  _reset = () => {
    this.target.fieldSelectors = [new FieldSelector(this, '*')];
    this.filterSegments = [[this.uiSegmentSrv.newPlusButton()]];
    this._updateFilterTarget();
  };

  /**
   * Called if the api is changing.
   */
  onApiChange = () => {
    this._reset();
    this.panelCtrl.refresh();
  };

  /**
   * Removes the filter at the given index.
   */
  removeFilter = (index) => {
    this.filterSegments.splice(index, 1);
    this._updateFilterTarget();
    this.panelCtrl.refresh();
  };

  /**
   * Called when a filter is changing.
   */
  onFilterSegmentUpdate = (segment, parentIndex, index) => {
    if (segment.type === 'plus-button') {
      this._addFilterSegment(segment);
      return;
    }

    if (index == 2) {
      const segmentValue = segment.value;
      if (/\/.*\/\w*/.test(segmentValue)) {
        this.filterSegments[parentIndex][1] = this.uiSegmentSrv.newOperator('=~');
      }
    }

    this._updateFilterTarget();

    this.target.test2 = Math.random();

    this.panelCtrl.refresh();
  };

  /**
   * Adds a new filter.
   */
  _addFilterSegment = (sourceSegment: any) => {
    this.filterSegments.pop();

    let segmentArray = [
      this.uiSegmentSrv.newKey(sourceSegment.value),
      this.uiSegmentSrv.newOperator('='),
      this.uiSegmentSrv.newFake('select filter value', 'value', 'query-segment-value'),
    ];

    this.filterSegments.push(segmentArray);
    this.filterSegments.push([this.uiSegmentSrv.newPlusButton()]);
  };

  /**
   * Returns selectable options for filter segments.
   */
  getFilterSegmentOptions = (segment, parentIndex, index) => {
    let segments: any[] = [];

    if (segment.type === 'operator') {
      segments = this.uiSegmentSrv.newOperators(['=', '=~', '!=', '!~', '<', '>']);
    } else if (this.dataPreview && this.dataPreview.length > 0) {
      let options: string[] = [];
      if (index === 0) {
        options = this.getAllDeepKeys();
      } else if (index === 2) {
        let filterKey = this.filterSegments[parentIndex][0].value;
        options = _(this.dataPreview)
          .map((data) => _.get(data, filterKey))
          .uniq()
          .value();

        _.each(this.templateSrv.variables, (variable) =>
          options.unshift('/$' + variable.name + '/')
        );
      }
      segments = _.map(options, (option) => this.uiSegmentSrv.newSegment(String(option)));
    }

    return this.$q.when(segments);
  };

  _updateFilterTarget = () => {
    const target = <GrafanaTarget>this.target;

    // update client filters
    const clientFilters = _(this.filterSegments)
      .filter((segmentArray) => segmentArray.length === 3)
      .filter((segmentArray) => !segmentArray[2].fake)
      .map((segmentArray) => {
        return <ClientSideFilter>{
          key: segmentArray[0].value,
          matcher: segmentArray[1].value,
          value: segmentArray[2].value,
        };
      })
      .value();

    target.clientSideFilters = clientFilters;
  };

  /**
   * Returns all existing keys of the current data preview.
   */
  getAllDeepKeys = () => {
    return _.flatMap(this.combineKeys(this.dataPreview[0]), (e) => e);
  };

  /**
   * Returns selectable options for the field segments.
   */
  getFieldSelectorOptions = (segment, parentIndex, index) => {
    let segments: any[] = [];

    if (this.dataPreview && this.dataPreview.length > 0) {
      let options: string[] = [];

      let currentSelection: any = this.dataPreview[0];

      if (index > 0) {
        for (let i = 0; i < index; i++) {
          let fieldSegment = this.target.fieldSelectors[parentIndex].fieldSegments[i];
          currentSelection = _.get(currentSelection, fieldSegment.value);
        }
      }

      options = _.concat(options, ['*']);
      options = _.concat(options, Object.keys(currentSelection));

      options.sort();

      segments = _.map(options, (option) =>
        this.uiSegmentSrv.newSegment({value: option})
      );
    }

    return this.$q.when(segments);
  };

  /**
   * Called if a field segment is changed.
   */
  onFieldSelectorSegmentUpdate = (segment, parentIndex, index) => {
    if (segment == this.addFieldSegment) {
      this.target.fieldSelectors.push(new FieldSelector(this, segment.value));
      this.addFieldSegment = this.uiSegmentSrv.newPlusButton();
    } else {
      this.target.fieldSelectors[parentIndex].refresh(this);
    }

    this.panelCtrl.refresh();
  };

  /**
   * Removes the field selector on the specified index.
   */
  removeField = (index) => {
    this.target.fieldSelectors.splice(index, 1);
    this.panelCtrl.refresh();
  };

  /**
   * Called if an alias is changing.
   */
  onAliasChange = (parentIndex) => {
    this.panelCtrl.refresh();
  };

  combineKeys = (object) => {
    let keys: string[] = Object.keys(object);

    return _.flatMap(keys, (key) => {
      if (_.isPlainObject(object[key])) {
        return _.map(this.combineKeys(object[key]), (nestedKeys) => {
          return key + '.' + nestedKeys;
        });
      } else {
        return key;
      }
    });
  };

  onDataReceived = (dataList) => {
    //TODO
  };

  /**
   * Called when a request is finished. The requests data is stored and used as a data preview which is basis for auto completions.
   */
  onResponseReceived = (response) => {
    if (!response.config.url.endsWith('/auth')) {
      this.dataPreview = response.data;
    }
  };

  onRefresh = () => {
    //TODO
    this.dataPreview = '';
  };

  /**
   * Returns a string representation of the current query configuration.
   */
  getCollapsedText() {
    return targetToQueryString(this.target);
  }
}
