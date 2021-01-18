export interface JWTPayload {
  username: string;
  email: string;
  tokenType: string;
  iat: number;
  exp: number;
}
