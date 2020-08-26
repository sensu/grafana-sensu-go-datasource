import {DataPoint, GrafanaTable, GrafanaTimeSeries} from '../types';
import table_transform from './table_transformer';
import timeseries_transform from './timeseries_transformer';

export default {
  toTable: (dataMatrix: DataPoint[][]): GrafanaTable => {
    return table_transform(dataMatrix);
  },
  toTimeSeries: (dataMatrix: DataPoint[][]): GrafanaTimeSeries[] => {
    return timeseries_transform(dataMatrix);
  },
};
