import _ from 'lodash';
import {SensuQueryCtrl} from './query_ctrl';

/**
 * Helper class for building field selectors.
 * This class should be refactored => no segments should be in `target` but directly in the query controller.
 */
export default class FieldSelector {
  fieldSegments: any[];
  fieldType: string;
  attributePath: string;
  alias: string;

  /**
   * Restores the segments based on the given parameters.
   */
  static restore = (ctrl: SensuQueryCtrl, segments: any) => {
    const path = _(segments.fieldSegments)
      .map((segment) => segment.value)
      .join('.');

    const selector: FieldSelector = new FieldSelector(ctrl, path);

    selector.alias = segments.alias;

    return selector;
  };

  constructor(ctrl: SensuQueryCtrl, initPath: string) {
    this.fieldSegments = _.map(initPath.split('.'), (path) =>
      ctrl.uiSegmentSrv.newKey(path)
    );
    this.refresh(ctrl);
  }

  /**
   * Refreshes the selectors UI elements - if a segment changes its value.
   */
  refresh = (ctrl: SensuQueryCtrl) => {
    if (!ctrl.dataPreview || ctrl.dataPreview.length <= 0) {
      return;
    }
    let selection = ctrl.dataPreview[0];

    for (let i = 0; i < this.fieldSegments.length; i++) {
      const segment: any = this.fieldSegments[i];
      const value: string = segment.value;

      if (selection) {
        selection = _.get(selection, value);
      }

      if (value === '*') {
        this.fieldSegments = this.fieldSegments.slice(0, i + 1);
      }
    }

    if (selection === undefined) {
      this.fieldType = 'undefined';
    } else if (_.isPlainObject(selection)) {
      this.fieldSegments.push(ctrl.uiSegmentSrv.newKey('*'));
      this.fieldType = 'object';
    } else if (_.isArray(selection)) {
      this.fieldType = 'array';
    } else if (typeof selection === 'number') {
      this.fieldType = 'number';
    } else {
      this.fieldType = 'string';
    }

    this.attributePath = this.getPath();
  };

  /**
   * Returns the current attribute path of this selector.
   */
  getPath = () => {
    return _(this.fieldSegments)
      .map((segment) => segment.value)
      .join('.');
  };
}
