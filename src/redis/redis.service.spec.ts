import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { MockRedis } from './redis.mock';
import { UnauthorizedException } from '@nestjs/common';

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

  describe('isRefreshTokenValid()', () => {
    describe('When refresh token is present in db', () => {
      it('should not throw any error', async () => {
        const mockRedis = new MockRedis();
        // @ts-ignore
        service.redis = mockRedis;
        jest
          .spyOn(mockRedis, 'lrange')
          .mockImplementation(async () => ['mock refresh token']);

        await service.isRefreshTokenValid('userId', 'mock refresh token');
      });
    });

    describe('When refresh token is not present in db', () => {
      it('should throw UnauthorizedException', async () => {
        const mockRedis = new MockRedis();
        // @ts-ignore
        service.redis = mockRedis;
        jest.spyOn(mockRedis, 'lrange').mockImplementation(async () => []);

        try {
          await service.isRefreshTokenValid('userId', 'mock refresh token');
          expect('This line not to be executed').toBeFalsy();
        } catch (e) {
          expect(e).toBeInstanceOf(UnauthorizedException);
          expect(e?.message).toBe('refresh token is not valid');
        }
      });
    });
  });
});
