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
  GetTeamMethods,
  GetTeamResponse,
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
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { AuthModule } from '../auth/auth.module';
import { TeamService } from '../team/team.service';
import { TeamDocument } from '../team/team.schema';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly teamService: TeamService,
  ) {}

  @Post('user/signup')
  async signUp(@Body() userData: ISignUpRequest): Promise<SignUpResponse> {
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
    }
  }

  @Post('user/login')
  @HttpCode(200)
  async login(@Body() userData: ISignInRequest): Promise<SignInResponse> {
    const user = await this.userService.getUser(
      userData.email || userData.username,
      userData.type,
    );

    if (!user) {
      throw new NotFoundException('user not found');
    }

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
    @Param('userId') userId: string,
    @Query('method') method: GetUserMethods,
  ): Promise<IGetUserResponse> {
    const user = await this.userService.getUser(userId, method);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return {
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
  ): Promise<GenerateAccessTokenResponse> {
    const user = await this.userService.getUser(
      req.params['userId'],
      req.query['method'] as string,
    );

    const accessToken = await this.authService.generateAccessTokenByRefreshToken(
      user.id,
      AuthModule.getTokenFromBearerToken(req.headers.authorization),
    );

    return {
      accessToken,
    };
  }
}
