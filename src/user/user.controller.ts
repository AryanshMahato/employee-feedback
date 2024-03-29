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
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  GenerateAccessTokenResponse,
  GetUserResponse,
  SignInResponse,
  SignUpResponse,
} from './user.types';
import { UserService } from './user.service';
import { MongoError } from 'mongodb';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { AuthModule } from '../auth/auth.module';
import {
  GenerateAccessTokenRequestParams,
  GenerateAccessTokenRequestQuery,
  GetUserValidationParams,
  GetUserValidationQuery,
  SignInRequestBody,
  SignUpRequestBody,
} from './user.validation';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('user/signup')
  async signUp(@Body() userData: SignUpRequestBody): Promise<SignUpResponse> {
    try {
      const userId = await this.userService.signUp(userData);
      const accessToken = await this.authService.generateAccessToken(userId);
      const refreshToken = await this.authService.generateRefreshToken(userId);

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

      throw e;
    }
  }

  @Post('user/login')
  @HttpCode(200)
  async signIn(@Body() userData: SignInRequestBody): Promise<SignInResponse> {
    const user = await this.userService.getUser(
      userData.email || userData.username,
      userData.type,
      { withPassword: true },
    );

    if (!user) {
      throw new NotFoundException('user not found');
    }

    // TODO: Add password hashing
    if (user.password != userData.password) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.authService.generateAccessToken(user.id);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  @Get('users/:userId')
  @UseGuards(AuthGuard)
  async getUser(
    @Param() params: GetUserValidationParams,
    @Query() query: GetUserValidationQuery,
  ): Promise<GetUserResponse> {
    const user = await this.userService.getUser(params.userId, query.method);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return {
      _id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      ownedTeams: user.ownedTeams,
    };
  }

  @Get('users/:userId/generate-token')
  @UseGuards(AuthGuard)
  async generateAccessToken(
    @Req() req: Request,
    @Param() params: GenerateAccessTokenRequestParams,
    @Query() query: GenerateAccessTokenRequestQuery,
  ): Promise<GenerateAccessTokenResponse> {
    const user = await this.userService.getUser(
      params['userId'],
      query['method'] as 'username' | 'email',
    );

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const accessToken = await this.authService.generateAccessTokenByRefreshToken(
      user.id,
      AuthModule.getTokenFromBearerToken(req.headers.authorization),
    );

    return {
      accessToken,
    };
  }
}
