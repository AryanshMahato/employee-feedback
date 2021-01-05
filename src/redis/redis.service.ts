import { Injectable } from '@nestjs/common';
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
}
