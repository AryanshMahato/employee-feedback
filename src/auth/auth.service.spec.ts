import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';
import { RedisModule } from '../redis/redis.module';
import { JWTPayload } from './auth.types';
import { RedisService } from '../redis/redis.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        PassportModule,
        JwtModule.register({
          secret: EnvConfig.jwtSecret,
        }),
        RedisModule,
      ],
      providers: [AuthService],
      exports: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('getUserFromToken()', () => {
    describe('When token is passed', () => {
      it('should return mocked payload', () => {
        const mockPayload = {
          exp: 3600,
          iat: 3600,
          tokenType: 'Bearer',
          userId: 'userId',
        };

        jest
          .spyOn(jwtService, 'verify')
          .mockImplementation((): JWTPayload => mockPayload);

        const payload = service.getUserFromToken('Bearer token');

        expect(payload).toEqual(mockPayload);
        expect(jwtService.verify).toBeCalledTimes(1);
      });
    });
  });

  describe('generateAccessToken()', () => {
    describe('When userId is passed', () => {
      it('should return signed access token', async () => {
        jest.spyOn(jwtService, 'sign').mockImplementation(() => 'signed-token');

        const accessToken = await service.generateAccessToken('userId');

        expect(accessToken).toBe('signed-token');
        expect(jwtService.sign).toBeCalledTimes(1);
      });
    });
  });

  describe('generateRefreshToken()', () => {
    describe('When userId is passed', () => {
      it('should return signed refresh token', async () => {
        jest.spyOn(jwtService, 'sign').mockImplementation(() => 'signed-token');

        jest.spyOn(redisService, 'saveRefreshToken').mockImplementation(() => {
          return new Promise((res) => res());
        });

        const accessToken = await service.generateRefreshToken('userId');

        expect(accessToken).toBe('signed-token');
        expect(jwtService.sign).toBeCalledTimes(1);
        expect(redisService.saveRefreshToken).toBeCalledTimes(1);
      });
    });
  });

  describe('generateAccessTokenByRefreshToken()', () => {
    describe('When refresh token is valid', () => {
      it('should return signed access token', async () => {
        jest.spyOn(jwtService, 'sign').mockImplementation(() => 'signed-token');

        jest
          .spyOn(redisService, 'isRefreshTokenValid')
          .mockImplementation(() => {
            return new Promise((res) => res());
          });

        const accessToken = await service.generateAccessTokenByRefreshToken(
          'userId',
          'refreshToken',
        );

        expect(accessToken).toBe('signed-token');
        expect(jwtService.sign).toBeCalledTimes(1);
        expect(redisService.isRefreshTokenValid).toBeCalledTimes(1);
      });
    });

    describe('When refresh token is invalid', () => {
      it('should throw error', async () => {
        jest.spyOn(jwtService, 'sign').mockImplementation(() => 'signed-token');

        jest
          .spyOn(redisService, 'isRefreshTokenValid')
          .mockImplementation(() => {
            throw new UnauthorizedException('refresh token is not valid');
          });

        try {
          await service.generateAccessTokenByRefreshToken(
            'userId',
            'refreshToken',
          );

          expect('this line not to be executed').toBeFalsy();
        } catch (e) {
          expect(e).toBeInstanceOf(UnauthorizedException);
          expect(e?.message).toBe('refresh token is not valid');
        }
      });
    });
  });
});
