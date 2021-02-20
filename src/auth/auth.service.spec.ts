import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';
import { RedisModule } from '../redis/redis.module';
import { JWTPayload } from './auth.types';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

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
});
