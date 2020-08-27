import _ from 'lodash';
import {DataPoint} from '../types';

const count = (data: any[], name: string): DataPoint[] => {
  return <DataPoint[]>[
    {
      name,
      value: data.length,
    },
  ];
};

const sum = (
  data: any[],
  name: string,
  targetField: string | undefined
): DataPoint[] | null => {
  if (!targetField) {
    return [];
  }

  let sum: number | null = _.sumBy(data, targetField);

  if (!_.isFinite(sum)) {
    sum = null;
  }

  return <DataPoint[]>[
    {
      name,
      value: sum,
    },
  ];
};

export default {count, sum};
