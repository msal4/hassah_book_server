export interface JwtAccessPayload {
  userId: string;
}

export interface JwtRefreshPayload {
  userId: string;
  tokenVersion: number;
}
