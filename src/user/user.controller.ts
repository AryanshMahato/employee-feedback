import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import {
  GetUserMethods,
  IGetUserResponse,
  ISignInRequest,
  ISignUpRequest,
  SignInResponse,
  SignUpResponse,
} from './user.types';
import { UserService } from './user.service';
import { MongoError } from 'mongodb';
import { AuthService } from '../auth/auth.service';
import { User } from './user.schema';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('user/signup')
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

  @Post('user/login')
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

  @Get('users/:userId')
  async getUser(
    @Param('userId') userId: string,
    @Query('method') method: GetUserMethods,
  ): Promise<IGetUserResponse> {
    let user: User;
    if (method === 'username') {
      user = await this.userService.getUserByUsername(userId);
    } else {
      user = await this.userService.getUserByEmail(userId);
    }

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
