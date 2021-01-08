import { Injectable, UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import IORedis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redis: IORedis.Redis;

  constructor() {
    this.redis = new Redis();
  }

  health = (): string => {
    return this.redis.status;
  };

  private getRefreshTokens = async (userId: string): Promise<string[]> => {
    return this.redis.lrange(userId, 0, -1);
  };

  isRefreshTokenValid = async (
    username: string,
    refreshToken: string,
  ): Promise<void> => {
    const tokens = await this.getRefreshTokens(username);
    if (!tokens.includes(refreshToken)) {
      throw new UnauthorizedException('refresh token is not valid');
    }
  };

  saveRefreshToken = async (
    username: string,
    refreshToken: string,
  ): Promise<void> => {
    await this.redis.lpush(username, refreshToken);
  };
}
