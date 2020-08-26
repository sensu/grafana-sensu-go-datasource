import _ from 'lodash';
import {ClientSideFilter, GrafanaTarget} from '../types';

/** The latest configuration version. */
const LATEST_VERSION = 2;

/** Migrates the passed configuration target to the latest version. The passed object will be mutated. */
const migrate = (target: GrafanaTarget) => {
  const {version} = target;

  if (version === undefined) {
    init(target);
  }
  if (version === 1) {
    toVersion2(target);
  }

  return target;
};

/** Initializes the configuration target. */
const init = (target: GrafanaTarget) => {
  target.version = LATEST_VERSION;
  target.clientSideFilters = [];
  target.serverSideFilters = [];
};

/** Migrates the passed configuration target from version 1 to version 2. */
const toVersion2 = (target: GrafanaTarget) => {
  console.log('Migrating data source configuration to version 2.');

  const {filterSegments} = target;

  const filters = _(filterSegments)
    .filter(segments => segments.length === 3)
    .filter(segments => !_.get(segments[2], 'fake', false))
    .map(segments => {
      const matcher = segments[1].value === '=' ? '==' : segments[1].value;

      return <ClientSideFilter>{
        key: segments[0].value,
        matcher,
        value: segments[2].value,
      };
    })
    .value();

  delete target.filterSegments;

  target.clientSideFilters = filters;
  target.serverSideFilters = [];

  target.version = 2;
};

export default {
  migrate,
};
