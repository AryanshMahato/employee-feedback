import { User } from './user.schema';

export type ISignUpRequest = SignUpRequest;

export class SignUpRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class SignUpResponse {
  id: string;
  accessToken: string;
  refreshToken: string;
}

export type ISignInRequest = SignInRequest;

export class SignInRequest {
  email?: string;
  username?: string;
  type: 'email' | 'username';
  password: string;
}

export class SignInResponse {
  accessToken: string;
  refreshToken: string;
}

export interface GenerateAccessTokenResponse {
  accessToken: string;
}

export type IUser = User;

export type IGetUserResponse = Omit<IUser, 'password'>;

export type GetUserMethods = 'username' | 'email';
