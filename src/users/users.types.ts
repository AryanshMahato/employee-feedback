export type ISignUpRequest = SignUpRequest;

export class SignUpRequest {
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
