import Filter from './Filter';

export default interface QueryComponents {
  readonly apiKey: string;
  readonly namespace: string;
  readonly selectedField: string;
  readonly filters: Filter[];
};
