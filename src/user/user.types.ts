import { User } from './user.schema';
import { ITeam } from '../team/team.types';
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

export type GetTeamMethods = 'created' | 'lead' | 'member';

export type GetTeamResponse = ITeam[];
