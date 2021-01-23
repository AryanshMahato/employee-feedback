import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import { ConflictException, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';
import { UserService } from './user.service';
import { UserModelMock } from './user.mock';
import { TeamModuleMock } from '../team/team.mock';
import { AuthModuleMock } from '../auth/auth.mock';
import { SignUpRequestBody } from './user.validation';
import { AuthService } from '../auth/auth.service';
import { SignUpResponse } from './user.types';
import { MongoError } from 'mongodb';

describe('UsersController', () => {
  let controller: UserController;
  let service: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        forwardRef(() => AuthModuleMock),
        forwardRef(() => TeamModuleMock),
        JwtModule.register({
          secret: EnvConfig.jwtSecret,
        }),
      ],
      providers: [
        UserService,
        { provide: getModelToken(User.name), useClass: UserModelMock },
      ],
      controllers: [UserController],
      exports: [UserService],
    }).compile();

    controller = await module.get<UserController>(UserController);
    service = await module.get<UserService>(UserService);
    authService = await module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp()', () => {
    const Data = {
      id: 'userId',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    describe('When signup is called and user is created successfully', () => {
      it('should return mock userId', async () => {
        const signUpMock = jest
          .spyOn(service, 'signUp')
          .mockImplementation(async () => {
            return Data.id;
          });

        const generateAccessTokenMock = jest
          .spyOn(authService, 'generateAccessToken')
          .mockImplementation(async () => {
            return Data.accessToken;
          });

        const generateRefreshTokenMock = jest
          .spyOn(authService, 'generateRefreshToken')
          .mockImplementation(async () => {
            return Data.refreshToken;
          });

        const userId = await controller.signUp({} as SignUpRequestBody);

        expect(userId).toEqual(Data);

        expect(signUpMock).toBeCalledTimes(1);
        expect(generateAccessTokenMock).toBeCalledTimes(1);
        expect(generateRefreshTokenMock).toBeCalledTimes(1);
      });
    });

    describe('When signup is called and user already exists in database', () => {
      it('should return mock userId', async () => {
        const signUpMock = jest
          .spyOn(service, 'signUp')
          .mockImplementation(async () => {
            throw new MongoError({ code: 11000 });
          });

        const generateAccessTokenMock = jest
          .spyOn(authService, 'generateAccessToken')
          .mockImplementation(async () => {
            return Data.accessToken;
          });

        const generateRefreshTokenMock = jest
          .spyOn(authService, 'generateRefreshToken')
          .mockImplementation(async () => {
            return Data.refreshToken;
          });

        let response: SignUpResponse;

        try {
          response = await controller.signUp({} as SignUpRequestBody);
        } catch (e) {
          expect(response).not.toBeDefined();
          expect(e).toBeInstanceOf(ConflictException);
          expect(e?.message).toBe('Conflict in user signup');

          expect(signUpMock).toBeCalledTimes(1);
          expect(generateAccessTokenMock).toBeCalledTimes(0);
          expect(generateRefreshTokenMock).toBeCalledTimes(0);
        }
      });
    });

    describe('When signup is called and there is some unknown error', () => {
      it('should return mock userId', async () => {
        const signUpMock = jest
          .spyOn(service, 'signUp')
          .mockImplementation(async () => {
            throw new Error('unknown error');
          });

        const generateAccessTokenMock = jest
          .spyOn(authService, 'generateAccessToken')
          .mockImplementation(async () => {
            return Data.accessToken;
          });

        const generateRefreshTokenMock = jest
          .spyOn(authService, 'generateRefreshToken')
          .mockImplementation(async () => {
            return Data.refreshToken;
          });

        let response: SignUpResponse;

        try {
          response = await controller.signUp({} as SignUpRequestBody);
        } catch (e) {
          expect(response).not.toBeDefined();
          expect(e).toBeInstanceOf(Error);
          expect(e?.message).toBe('unknown error');

          expect(signUpMock).toBeCalledTimes(1);
          expect(generateAccessTokenMock).toBeCalledTimes(0);
          expect(generateRefreshTokenMock).toBeCalledTimes(0);
        }
      });
    });
  });
});
