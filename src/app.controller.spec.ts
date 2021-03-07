import { AppController } from './app.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfig } from './config/EnvConfig';
import {
  HealthCheckService,
  MongooseHealthIndicator,
  TerminusModule,
} from '@nestjs/terminus';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';

describe('AppController', () => {
  let controller: AppController;
  let redisService: RedisService;
  let healthService: HealthCheckService;
  let mongooseHealthIndicator: MongooseHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRoot(EnvConfig.databaseURL, {
          useNewUrlParser: true,
        }),
        TerminusModule,
        RedisModule,
      ],
      controllers: [AppController],
      providers: [],
    }).compile();

    controller = await module.get<AppController>(AppController);
    redisService = await module.get<RedisService>(RedisService);
    healthService = await module.get<HealthCheckService>(HealthCheckService);
    mongooseHealthIndicator = await module.resolve<MongooseHealthIndicator>(
      MongooseHealthIndicator,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(redisService).toBeDefined();
    expect(healthService).toBeDefined();
    expect(mongooseHealthIndicator).toBeDefined();
  });
});
