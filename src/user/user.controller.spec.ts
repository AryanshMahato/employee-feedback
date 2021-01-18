import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import { AuthModule } from '../auth/auth.module';
import { forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';
import { UserService } from './user.service';
import { UserModelMock } from './user.mock';

describe('UsersController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const teamModule = await Test.createTestingModule({});

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        forwardRef(() => teamModule),
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

    controller = await module.resolve<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
