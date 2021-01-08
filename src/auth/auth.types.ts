export interface JWTPayload {
  username: string;
  email: string;
  iat: number;
  exp: number;
}
