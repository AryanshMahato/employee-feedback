import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';
import { RedisModule } from '../redis/redis.module';
import { JWTPayload } from './auth.types';
import { RedisService } from '../redis/redis.service';

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

        const mockJwtService = jest
          .spyOn(jwtService, 'verify')
          .mockImplementation((): JWTPayload => mockPayload);

        const payload = service.getUserFromToken('Bearer token');

        expect(payload).toEqual(mockPayload);
        expect(mockJwtService).toBeCalledTimes(1);
      });
    });
  });

  describe('generateAccessToken()', () => {
    describe('When userId is passed', () => {
      it('should return signed access token', async () => {
        const mockJwtService = jest
          .spyOn(jwtService, 'sign')
          .mockImplementation(() => 'signed-token');

        const accessToken = await service.generateAccessToken('userId');

        expect(accessToken).toBe('signed-token');
        expect(mockJwtService).toBeCalledTimes(1);
      });
    });
  });

  describe('generateRefreshToken()', () => {
    describe('When userId is passed', () => {
      it('should return signed refresh token', async () => {
        const mockJwtService = jest
          .spyOn(jwtService, 'sign')
          .mockImplementation(() => 'signed-token');

        jest.spyOn(redisService, 'saveRefreshToken').mockImplementation(() => {
          return new Promise((res) => res());
        });

        const accessToken = await service.generateAccessToken('userId');

        expect(accessToken).toBe('signed-token');
        expect(mockJwtService).toBeCalledTimes(1);
      });
    });
  });
});
