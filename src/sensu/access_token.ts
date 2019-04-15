export default interface AccessToken {
  readonly access_token: string;
  readonly expires_at: number;
  readonly refresh_token: string;
  expires_offset?: number;
};
