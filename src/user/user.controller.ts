import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ISignInRequest,
  ISignUpRequest,
  SignInResponse,
  SignUpResponse,
} from './user.types';
import { UserService } from './user.service';
import { MongoError } from 'mongodb';
import { AuthService } from '../auth/auth.service';
import { User } from './user.schema';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signUp(@Body() userData: ISignUpRequest): Promise<SignUpResponse> {
    try {
      const userId = await this.userService.signUp(userData);
      const accessToken = await this.authService.generateAccessToken(
        userData.username,
      );
      const refreshToken = await this.authService.generateRefreshToken(
        userData.username,
      );

      return {
        accessToken,
        id: userId,
        refreshToken,
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

  @Post('login')
  @HttpCode(200)
  async login(@Body() userData: ISignInRequest): Promise<SignInResponse> {
    let user: User;
    if (userData.type === 'email') {
      user = await this.userService.getUserByEmail(userData.email);
    }
    if (userData.type === 'username') {
      user = await this.userService.getUserByUsername(userData.username);
    }

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (user.password != userData.password) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.authService.generateAccessToken(
      userData.username,
    );
    const refreshToken = await this.authService.generateRefreshToken(
      userData.username,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
