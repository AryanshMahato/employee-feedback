import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';
import { RedisModule } from '../redis/redis.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { MockAuthExecutionContext } from './auth.mock';
import { Request } from 'express';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
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
      providers: [AuthService, AuthGuard],
      exports: [AuthService],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  describe('When passed token is valid', () => {
    it('should return true', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        return new Promise((res) => {
          res('success');
        });
      });

      const authExecutionContext = new MockAuthExecutionContext();

      jest
        .spyOn(authExecutionContext, 'getRequest')
        .mockImplementation(
          () => ({ headers: { authorization: 'Bearer token' } } as Request),
        );

      const res = await authGuard.canActivate(
        (authExecutionContext as unknown) as ExecutionContext,
      );

      expect(res).toBe(true);
    });
  });

  describe('When passed token is not bearer token', () => {
    it('should throw UnauthorizedException', async () => {
      try {
        const authExecutionContext = new MockAuthExecutionContext();

        await authGuard.canActivate(
          (authExecutionContext as unknown) as ExecutionContext,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e?.message).toBe('bearer token not found');
      }
    });
  });

  describe('When passed token is invalid bearer token', () => {
    it('should throw UnauthorizedException', async () => {
      try {
        jest.spyOn(jwtService, 'verify').mockImplementation(() => {
          throw new Error();
        });

        const authExecutionContext = new MockAuthExecutionContext();

        jest
          .spyOn(authExecutionContext, 'getRequest')
          .mockImplementation(
            () => ({ headers: { authorization: 'Bearer token' } } as Request),
          );

        await authGuard.canActivate(
          (authExecutionContext as unknown) as ExecutionContext,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e?.message).toBe('jwt verification failed');
      }
    });
  });
});
