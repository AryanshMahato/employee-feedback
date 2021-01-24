import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import { AuthModule } from '../auth/auth.module';
import { forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';
import { UserController } from './user.controller';
import { UserModelMock } from './user.mock';
import { TeamModuleMock } from '../team/team.mock';
import clearAllMocks = jest.clearAllMocks;

beforeEach(clearAllMocks);

describe('UsersService', () => {
  let service: UserService;
  const userModel = new UserModelMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        forwardRef(() => TeamModuleMock),
        JwtModule.register({
          secret: EnvConfig.jwtSecret,
        }),
      ],
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
      controllers: [UserController],
      exports: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp()', () => {
    const Data = {
      userId: 'userId',
      email: 'test@test.com',
      firstName: 'test',
      lastName: 'user',
      password: 'test123',
      username: 'test',
    };

    describe('when signup is called and database operation is successful', () => {
      it('should return correct userId', async () => {
        const mockUserModel = jest
          .spyOn(userModel, 'create')
          .mockImplementation(async () => {
            return { id: Data.userId };
          });

        const userId = await service.signUp(Data);

        expect(userId).toBe(Data.userId);
        expect(mockUserModel).toBeCalledTimes(1);
      });
    });

    describe('when signup is called and database operation is failed', () => {
      it('should throw same error', async () => {
        const mockUserCreate = jest
          .spyOn(userModel, 'create')
          .mockImplementation(async () => {
            throw new Error('unknown error');
          });

        let userId: string;

        try {
          userId = await service.signUp(Data);
          expect('This line no to be executed').toBeFalsy();
        } catch (e) {
          expect(e).toBeInstanceOf(Error);
          expect(e?.message).toBe('unknown error');

          expect(userId).not.toBeDefined();
          expect(mockUserCreate).toBeCalledTimes(1);
        }
      });
    });
  });

  describe('getUser()', () => {
    const Data = {
      id: 'id',
      name: 'test',
    };

    describe('when database is called with and user is found by username', () => {
      it('should return correct name', async () => {
        const mockUserFindOne = jest
          .spyOn(userModel, 'findOne')
          .mockImplementation(() => {
            return {
              populate: (): unknown => ({
                select: (): unknown => ({
                  exec: (): unknown => ({
                    id: Data.id,
                    name: Data.name,
                  }),
                }),
              }),
            };
          });

        const user = await service.getUser(Data.id, 'username');

        expect(user).toEqual(Data);

        expect(mockUserFindOne).toBeCalledTimes(1);
      });
    });

    describe('when database is called with and user is found by email', () => {
      it('should return correct name', async () => {
        const mockUserFindOne = jest
          .spyOn(userModel, 'findOne')
          .mockImplementation(() => {
            return {
              populate: (): unknown => ({
                select: (): unknown => ({
                  exec: (): unknown => ({
                    id: Data.id,
                    name: Data.name,
                  }),
                }),
              }),
            };
          });

        const user = await service.getUser(Data.id, 'email');

        expect(user).toEqual(Data);

        expect(mockUserFindOne).toBeCalledTimes(1);
      });
    });
  });
});
