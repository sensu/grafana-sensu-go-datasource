import _ from 'lodash';
import {DataPoint} from '../types';

/**
 * Does a count aggregation. The number of elements in the given data is returned.
 *
 * @param data the data to aggregate
 * @param name  the name of the resulting value
 */
const count = (data: any[], name: string): DataPoint[] => {
  return <DataPoint[]>[
    {
      name,
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
