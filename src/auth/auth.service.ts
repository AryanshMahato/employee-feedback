import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './auth.types';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  private signAccessToken = (
    payload: Pick<JWTPayload, 'email' | 'username'>,
  ): string => {
    return this.jwtService.sign(
      { ...payload, tokenType: 'Access' },
      {
        expiresIn: '1h',
      },
    );
  };

  private signRefreshToken = (
    payload: Pick<JWTPayload, 'email' | 'username'>,
  ): string => {
    return this.jwtService.sign(
      { ...payload, tokenType: 'Refresh' },
      {
        expiresIn: '30d',
      },
    );
  };

  generateAccessToken = async (
    username: string,
    email: string,
  ): Promise<string> => {
    const payload = { username, email };
    return this.signAccessToken(payload);
  };

  generateRefreshToken = async (
    username: string,
    email: string,
  ): Promise<string> => {
    const payload = { username, email };
    const token = this.signRefreshToken(payload);
    await this.redisService.saveRefreshToken(username, token);
    return token;
  };

  generateAccessTokenByRefreshToken = async (
    username: string,
    email: string,
    refreshToken: string,
  ): Promise<string> => {
    await this.redisService.isRefreshTokenValid(username, refreshToken);

    const payload = { username, email } as JWTPayload;

    return this.signAccessToken(payload);
  };
}
