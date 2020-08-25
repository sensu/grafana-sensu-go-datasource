import _ from 'lodash';

/**
 * Returns whether the given data value matchs the filter specified by the filter value in combination with the given operator.
 * @param filterValue the filter value
 * @param operator the operator used for comparision
 * @param dataValue the data value to test
 */
export const matchs = (filterValue: string, operator: string, dataValue: any) => {
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
const _matchNumber = (filterValue: string, operator: string, dataValue: any) => {
  const filterNumber = Number(filterValue);

  if (!_.isFinite(filterNumber)) {
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
const _matchRegExp = (filterValue: string, operator: string, dataValue: any) => {
  const regex: RegExp = _stringToRegex(filterValue);

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
const _stringToRegex = (value: string) => {
  const regex = value.match(/\/(.*)\/(\w*)/);
  if (regex) {
    return new RegExp(regex[1], regex[2]);
  } else {
    return new RegExp(value);
  }
};

export default {matchs};
