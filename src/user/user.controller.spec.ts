import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import { forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';
import { UserService } from './user.service';
import { UserModelMock } from './user.mock';
import { TeamModuleMock } from '../team/team.mock';
import { AuthModuleMock } from '../auth/auth.mock';

describe('UsersController', () => {
  let controller: UserController;

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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
