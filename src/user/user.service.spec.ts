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

describe('UsersService', () => {
  let service: UserService;

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
        { provide: getModelToken(User.name), useClass: UserModelMock },
      ],
      controllers: [UserController],
      exports: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
