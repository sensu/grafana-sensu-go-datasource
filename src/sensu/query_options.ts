export default interface QueryOptions {
  method: string;
  url: string;
  namespace: string;
  limit: number;
  forceAccessTokenRefresh?: boolean;
};
