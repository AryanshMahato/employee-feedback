import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { ISignUpRequest, SignUpResponse } from './user.types';
import { UserService } from './user.service';
import { MongoError } from 'mongodb';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() userData: ISignUpRequest): Promise<SignUpResponse> {
    try {
      const userId = await this.userService.signUp(userData);

      return {
        accessToken: '',
        id: userId,
        refreshToken: '',
      };
    } catch (e) {
      if (e instanceof MongoError) {
        if (e.code === 11000) {
          throw new ConflictException({
            message: 'Conflict in user signup',
            field: e['keyValue'],
          });
        }
      }
    }
  }
}
