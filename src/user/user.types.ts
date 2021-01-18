import { User } from './user.schema';
import { SignUpRequestBody } from './user.validation';

export interface GetUserOptions {
  withPassword: boolean;
}

export type SignUpRequest = SignUpRequestBody;

export class SignUpResponse {
  id: string;
  accessToken: string;
  refreshToken: string;
}

export class SignInResponse {
  accessToken: string;
  refreshToken: string;
}

export interface GenerateAccessTokenResponse {
  accessToken: string;
}

export type IUser = User;

export type GetUserResponse = Omit<IUser, 'password'>;

export type GetUserMethods = 'username' | 'email';
