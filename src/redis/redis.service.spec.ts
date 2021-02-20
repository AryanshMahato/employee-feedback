import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('health()', () => {
    describe('When database is connected', () => {
      it('should return OK as health', () => {
        // @ts-ignore
        service.redis = { status: 'OK' };

        expect(service.health()).toBe('OK');
      });
    });

    describe('When database is not connected', () => {
      it('should return OK as health', () => {
        // @ts-ignore
        service.redis = { status: 'Down' };

        expect(service.health()).toBe('Down');
      });
    });
  });
});
