import {DataPoint, GrafanaTimeSeries} from '../types';
import _ from 'lodash';

/**
 * Transforms the given data into a time series representation.
 */
const transform = (dataMatrix: DataPoint[][]): GrafanaTimeSeries[] => {
  const now: number = Date.now();

  // maps the data to a series - skips all values which are not finite
  // - name => series name
  // - value => value
  return _(dataMatrix)
    .flatten()
    .filter(data => _.isFinite(data.value))
    .map(data => {
      return <GrafanaTimeSeries>{
        target: data.name,
        datapoints: [[data.value, now]],
      };
    })
    .value();
};

export default transform;
