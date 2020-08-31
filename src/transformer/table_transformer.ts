import {DataPoint, GrafanaTable} from '../types';
import {TIME_PROPERTIES} from '../constants';
import _ from 'lodash';
import moment from 'moment';

/**
 * Transforms the given data into a table representation.
 */
const transform = (dataMatrix: DataPoint[][], vertical: boolean): GrafanaTable => {
  const columns = _extractColumns(dataMatrix);

  // create column index mapping
  const columnIndexMap = {};
  _.each(columns, (column, index) => (columnIndexMap[column.text] = index));

  // generate data rows
  const rows: any[][] = _.map(dataMatrix, dataRow => {
    const row = _.times(columns.length, _.constant(null));

    _(dataRow)
      .map(({name, value}) => {
        if (_.isArray(value)) {
          return _.map(value, (element, index) => [name + '[' + index + ']', element]);
        } else {
          return [[name, value]];
        }
      })
      .flatten()
      .map(data => {
        if (_.isPlainObject(data[1]) || _.isArray(data[1])) {
          data[1] = JSON.stringify(data[1]);
        }
        return data;
      })
      .each(([columnName, value]) => {
        row[columnIndexMap[columnName]] = value;
      });

    return row;
  });

  if (vertical) {
    return _asVerticalTable(columns, rows);
  }

  // create grafana result object
  return <GrafanaTable>{
    columns,
    rows,
    type: 'table',
  };
};

const _asVerticalTable = (dataColumns, dataRows: any[][]): GrafanaTable => {
  // fixed table headers
  const columns = [
    {
      text: 'Attribute',
    },
    {
      text: 'Value',
    },
  ];

  const rows = _(dataRows)
    .flatten()
    .map((value, idx) => [dataColumns[idx].text, value])
    .value();

  // this is done because users cannot define a time formatting based on rows
  _convertTimestamps(rows);

  return <GrafanaTable>{
    columns,
    rows,
    type: 'table',
  };
};

const _convertTimestamps = (rows: any[][]) => {
  _.each(rows, row => {
    const attribute = row[0];
    const value = row[1];

    for (let index = 0; index < TIME_PROPERTIES.length; index++) {
      if (attribute === TIME_PROPERTIES[index]) {
        const time = _.defaultTo(value, -1);
        if (time > 0) {
          row[1] = moment(time).format('YYYY-MM-DD HH:mm:ss');
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
const _extractColumns = (dataMatrix: DataPoint[][]) => {
  const isArrayMarker = {};

  // extract existing columns
  return _(dataMatrix)
    .flatten()
    .map(({name, value}) => {
      if (_.isArray(value)) {
        isArrayMarker[name] = true;
        return _.times(value.length, index => name + '[' + index + ']');
      } else {
        if (_.isNil(value) && _.get(isArrayMarker, name, false)) {
          return [];
        }
        return [name];
      }
    })
    .flatten()
    .uniq()
    .map(name => {
      return {
        text: name,
      };
    })
    .value();
};

export default transform;
