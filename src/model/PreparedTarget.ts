import Filter from './Filter';

export default interface PreparedTarget {
  readonly apiUrl: string;
  readonly filters: Filter[];
  readonly target: any;
};
