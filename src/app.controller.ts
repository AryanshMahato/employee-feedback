import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { RedisService } from './redis/redis.service';

@Controller('app')
export class AppController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongo: MongooseHealthIndicator,
    private readonly redis: RedisService,
  ) {}

  @Get('health')
  @HealthCheck()
  getHealth(): Promise<HealthCheckResult> {
    const checkRedisHealth = async (): Promise<HealthIndicatorResult> => {
      const health = this.redis.health();

      return {
        redisHealth: {
          status: health === 'ready' ? 'up' : 'down',
          health,
        },
      };
    };

    return this.health.check([
      (): Promise<HealthIndicatorResult> => this.mongo.pingCheck('mongodb'),
      (): Promise<HealthIndicatorResult> => checkRedisHealth(),
    ]);
  }
}
