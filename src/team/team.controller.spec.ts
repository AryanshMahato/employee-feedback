import { Test, TestingModule } from '@nestjs/testing';
import { TeamController } from './team.controller';
import { getModelToken } from '@nestjs/mongoose';
import { Team } from './team.schema';
import { AuthModule } from '../auth/auth.module';
import { forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';
import { TeamService } from './team.service';
import { TeamModelMock } from './team.mock';
import { UserModuleMock } from '../user/user.mock';

describe('TeamController', () => {
  let controller: TeamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        forwardRef(() => UserModuleMock),
        JwtModule.register({
          secret: EnvConfig.jwtSecret,
        }),
      ],
      controllers: [TeamController],
      providers: [
        TeamService,
        { provide: getModelToken(Team.name), useClass: TeamModelMock },
      ],
      exports: [TeamService],
    }).compile();

    controller = module.get<TeamController>(TeamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
