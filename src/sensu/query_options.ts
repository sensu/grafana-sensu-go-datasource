export default interface QueryOptions {
  method: string;
  url: string;
  namespace: string;
  limit?: string;
  forceAccessTokenRefresh?: boolean;
};
