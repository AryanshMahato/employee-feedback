import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './auth.types';
import { RedisService } from '../redis/redis.service';
import { AuthModule } from './auth.module';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  public getUserFromToken = (bearerToken: string): JWTPayload => {
    const token = AuthModule.getTokenFromBearerToken(bearerToken);
    return this.jwtService.verify<JWTPayload>(token);
  };

  private signAccessToken = (userId: string): string => {
    return this.jwtService.sign(
      { userId, tokenType: 'Access' },
      {
        expiresIn: '1h',
      },
    );
  };

  private signRefreshToken = (userId: string): string => {
    return this.jwtService.sign(
      { userId, tokenType: 'Refresh' },
      {
        expiresIn: '30d',
      },
    );
  };

  generateAccessToken = async (userId: string): Promise<string> => {
    return this.signAccessToken(userId);
  };

  generateRefreshToken = async (userId: string): Promise<string> => {
    const token = this.signRefreshToken(userId);
    await this.redisService.saveRefreshToken(userId, token);
    return token;
  };

  generateAccessTokenByRefreshToken = async (
    userId: string,
    refreshToken: string,
  ): Promise<string> => {
    await this.redisService.isRefreshTokenValid(userId, refreshToken);

    return this.signAccessToken(userId);
  };
}
