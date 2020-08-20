import {DataPoint} from '../types';
import table_transform from './table_transformer';
import timeseries_transform from './timeseries_transformer';

export default {
  toTable: (dataMatrix: DataPoint[][]) => {
    return table_transform(dataMatrix);
  },
  toTimeSeries: (dataMatrix: DataPoint[][]) => {
    return timeseries_transform(dataMatrix);
  },
};
