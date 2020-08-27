import {extractQueryComponents} from './query_util';
import {describe, expect, test} from '@jest/globals';
import {ServerSideFilterType} from '../types';

describe('extract query components from raw query string', () => {
  test('invalid query', () => {
    const result = extractQueryComponents('QUERY API *');

    expect(result).toBeNull();
  });

  test('invalid api', () => {
    const result = extractQueryComponents('QUERY API checks SELECT *');

    expect(result).toBeNull();
  });

  test('select field without namespace', () => {
    const result = extractQueryComponents('QUERY API events SELECT name');

    expect(result).toMatchObject({
      apiKey: 'events',
      namespace: 'default',
      selectedField: 'name',
      clientFilters: [],
      serverFilters: [],
      limit: NaN,
    });
  });

  test('select all from namespace', () => {
    const result = extractQueryComponents('QUERY API events IN NAMESPACE test SELECT *');

    expect(result).toHaveProperty('namespace', 'test');
  });

  test('select * with limit', () => {
    const result = extractQueryComponents('QUERY API events SELECT * LIMIT 50');

    expect(result).toHaveProperty('limit', 50);
  });

  test('select * with in-browser filter [=~]', () => {
    const result = extractQueryComponents(
      'QUERY API events SELECT * WHERE name=~/server/'
    );

    expect(result.clientFilters).toEqual([
      {key: 'name', matcher: '=~', value: '/server/'},
    ]);
    expect(result.serverFilters).toEqual([]);
  });

  test('select * with in-browser filter [=] - downwards compatibility', () => {
    const result = extractQueryComponents('QUERY API events SELECT * WHERE name=server');

    expect(result.clientFilters).toEqual([{key: 'name', matcher: '==', value: 'server'}]);
    expect(result.serverFilters).toEqual([]);
  });

  test('select * with in-browser filter [==]', () => {
    const result = extractQueryComponents('QUERY API events SELECT * WHERE name==server');

    expect(result.clientFilters).toEqual([{key: 'name', matcher: '==', value: 'server'}]);
    expect(result.serverFilters).toEqual([]);
  });

  test('select * with in-browser filter [!=]', () => {
    const result = extractQueryComponents('QUERY API events SELECT * WHERE name!=server');

    expect(result.clientFilters).toEqual([{key: 'name', matcher: '!=', value: 'server'}]);
    expect(result.serverFilters).toEqual([]);
  });

  test('select * with in-browser filter [<]', () => {
    const result = extractQueryComponents('QUERY API events SELECT * WHERE val<1');

    expect(result.clientFilters).toEqual([{key: 'val', matcher: '<', value: '1'}]);
    expect(result.serverFilters).toEqual([]);
  });

  test('select * with in-browser filter [>]', () => {
    const result = extractQueryComponents('QUERY API events SELECT * WHERE val>1');

    expect(result.clientFilters).toEqual([{key: 'val', matcher: '>', value: '1'}]);
    expect(result.serverFilters).toEqual([]);
  });

  test('select * with field selector [==]', () => {
    const result = extractQueryComponents(
      'QUERY API events SELECT * WHERE fieldSelector:val == 100'
    );

    expect(result.serverFilters).toEqual([
      {type: ServerSideFilterType.FIELD, key: 'val', matcher: '==', value: '100'},
    ]);
    expect(result.clientFilters).toEqual([]);
  });

  test('select * with field selector [!=]', () => {
    const result = extractQueryComponents(
      'QUERY API events SELECT * WHERE fieldSelector:val != 100'
    );

    expect(result.serverFilters).toEqual([
      {type: ServerSideFilterType.FIELD, key: 'val', matcher: '!=', value: '100'},
    ]);
    expect(result.clientFilters).toEqual([]);
  });

  test('select * with field selector [in]', () => {
    const result = extractQueryComponents(
      'QUERY API events SELECT * WHERE fieldSelector:val in 100'
    );

    expect(result.serverFilters).toEqual([
      {type: ServerSideFilterType.FIELD, key: 'val', matcher: 'in', value: '100'},
    ]);
    expect(result.clientFilters).toEqual([]);
  });

  test('select * with field selector [notin]', () => {
    const result = extractQueryComponents(
      'QUERY API events SELECT * WHERE fieldSelector:val notin 100'
    );

    expect(result.serverFilters).toEqual([
      {type: ServerSideFilterType.FIELD, key: 'val', matcher: 'notin', value: '100'},
    ]);
    expect(result.clientFilters).toEqual([]);
  });

  test('select * with field selector [matches]', () => {
    const result = extractQueryComponents(
      'QUERY API events SELECT * WHERE fieldSelector:val matches 100'
    );

    expect(result.serverFilters).toEqual([
      {type: ServerSideFilterType.FIELD, key: 'val', matcher: 'matches', value: '100'},
    ]);
    expect(result.clientFilters).toEqual([]);
  });

  test('select * with label selector [==]', () => {
    const result = extractQueryComponents(
      'QUERY API events SELECT * WHERE labelSelector:val matches 100'
    );

    expect(result.serverFilters).toEqual([
      {type: ServerSideFilterType.LABEL, key: 'val', matcher: 'matches', value: '100'},
    ]);
    expect(result.clientFilters).toEqual([]);
  });

  test('select * with spaces in field selector', () => {
    const result = extractQueryComponents(
      'QUERY API events SELECT * WHERE fieldSelector:"left value" == "right value"'
    );

    expect(result.serverFilters).toEqual([
      {
        type: ServerSideFilterType.FIELD,
        key: '"left value"',
        matcher: '==',
        value: '"right value"',
      },
    ]);
    expect(result.clientFilters).toEqual([]);
  });

  test('select * with arrays in field selector', () => {
    const result = extractQueryComponents(
      'QUERY API events SELECT * WHERE fieldSelector:["linux", "win"] IN ["right value"]'
    );

    expect(result.serverFilters).toEqual([
      {
        type: ServerSideFilterType.FIELD,
        key: '["linux", "win"]',
        matcher: 'IN',
        value: '["right value"]',
      },
    ]);
    expect(result.clientFilters).toEqual([]);
  });

  test('multiple filter statements', () => {
    const result = extractQueryComponents(
      'QUERY API events SELECT * WHERE fieldSelector:["linux", "win"] IN ["right value"] AND labelSelector:left != right AND attr == value'
    );

    expect(result.serverFilters).toEqual([
      {
        type: ServerSideFilterType.FIELD,
        key: '["linux", "win"]',
        matcher: 'IN',
        value: '["right value"]',
      },
      {
        type: ServerSideFilterType.LABEL,
        key: 'left',
        matcher: '!=',
        value: 'right',
      },
    ]);
    expect(result.clientFilters).toEqual([
      {
        key: 'attr',
        matcher: '==',
        value: 'value',
      },
    ]);
  });
});
