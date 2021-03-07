export interface JWTPayload {
  userId: string;
  tokenType: string;
  iat: number;
  exp: number;
}
