import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { getModelToken } from '@nestjs/mongoose';
import { Team } from './team.schema';
import { AuthModule } from '../auth/auth.module';
import { forwardRef, InternalServerErrorException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';
import { TeamController } from './team.controller';
import { TeamModelMock } from './team.mock';
import { UserModuleMock } from '../user/user.mock';

describe('TeamService', () => {
  let service: TeamService;
  const teamModel = new TeamModelMock();

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
        { provide: getModelToken(Team.name), useValue: teamModel },
      ],
      exports: [TeamService],
    }).compile();

    service = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(teamModel).toBeDefined();
  });

  describe('createTeam()', () => {
    const mockTeam = {
      name: 'Avengers',
      creator: 'creatorId',
      description: 'this is a description',
      lead: 'leaderId',
      members: ['memberId'],
    } as Team;

    describe('When team is created successfully', () => {
      it('should not throw any error', async () => {
        jest.spyOn(teamModel, 'create').mockImplementation(() => mockTeam);

        const team = await service.createTeam({
          name: mockTeam.name,
          description: mockTeam.description,
          creator: mockTeam.creator,
          lead: mockTeam.lead,
        });

        expect(team).toEqual(mockTeam);
        expect(teamModel.create).toBeCalledTimes(1);
      });
    });

    describe('When team team creation fails', () => {
      it('should throw error', async () => {
        jest.spyOn(teamModel, 'create').mockImplementation(() => {
          throw new InternalServerErrorException();
        });

        try {
          await service.createTeam({
            name: mockTeam.name,
            description: mockTeam.description,
            creator: mockTeam.creator,
            lead: mockTeam.lead,
          });

          expect('This line not to be executed').toBeFalsy();
        } catch (e) {
          expect(e).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });
  });
});
