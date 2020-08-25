import _ from 'lodash';
import {ClientSideFilter, GrafanaTarget} from '../types';

const LATEST_VERSION = 2;

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

const init = (target: GrafanaTarget) => {
  target.version = LATEST_VERSION;
  target.clientSideFilters = [];
  target.serverSideFilters = [];
};

const toVersion2 = (target: GrafanaTarget) => {
  console.log('Migrating data source configuration to version 2.');

  const {filterSegments} = target;

  const filters = _(filterSegments)
    .filter((segments) => segments.length === 3)
    .filter((segments) => !_.get(segments[2], 'fake', false))
    .map((segments) => {
      console.log('->', segments); //TODO REMOVE
      return <ClientSideFilter>{
        key: segments[0].value,
        matcher: segments[1].value,
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
