import { Controller, Post } from '@nestjs/common';
import { SignUpResponse } from './users.types';

@Controller('users')
export class UsersController {
  @Post('signup')
  signUp(): SignUpResponse {
    return {
      accessToken: '',
      id: '',
      refreshToken: '',
    };
  }
}
