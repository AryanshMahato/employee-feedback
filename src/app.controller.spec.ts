import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfig } from './config/EnvConfig';
import {
  HealthIndicatorResult,
  MongooseHealthIndicator,
  TerminusModule,
} from '@nestjs/terminus';

describe('Health', () => {
  let appController: AppController;
  let mongooseHealthIndicator: MongooseHealthIndicator;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(EnvConfig.databaseURL, {
          useNewUrlParser: true,
        }),
        TerminusModule,
      ],
      controllers: [AppController],
      providers: [],
    }).compile();

    mongooseHealthIndicator = await app.resolve<MongooseHealthIndicator>(
      MongooseHealthIndicator,
    );
    appController = app.get<AppController>(AppController);
  });

  // full testing will be done in e2e testing
  describe('when health is called with mongo connection', () => {
    it('should return status ok', async () => {
      jest.spyOn(mongooseHealthIndicator, 'pingCheck').mockImplementation(
        async (): Promise<HealthIndicatorResult> => ({
          mongodb: {
            status: 'up',
          },
        }),
      );

      const healthCheckResult = await appController.getHealth();
      expect(healthCheckResult.status).toBe('ok');
    });
  });
});
