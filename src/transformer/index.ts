import {DataPoint, GrafanaTable, GrafanaTimeSeries} from '../types';
import table_transform from './table_transformer';
import timeseries_transform from './timeseries_transformer';

export default {
  toTable: (dataMatrix: DataPoint[][], vertical: boolean): GrafanaTable => {
    return table_transform(dataMatrix, vertical);
  },
  toTimeSeries: (dataMatrix: DataPoint[][]): GrafanaTimeSeries[] => {
    return timeseries_transform(dataMatrix);
  },
};
