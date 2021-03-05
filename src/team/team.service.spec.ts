import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { getModelToken } from '@nestjs/mongoose';
import { Team, TeamPublicSelect } from './team.schema';
import { AuthModule } from '../auth/auth.module';
import { forwardRef, InternalServerErrorException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';
import { TeamController } from './team.controller';
import { TeamModelMock } from './team.mock';
import { UserModuleMock } from '../user/user.mock';
import { GetTeamByUserIdReturn, ITeam } from './team.types';
import { User, UserPublicSelect } from '../user/user.schema';
import clearAllMocks = jest.clearAllMocks;

afterEach(clearAllMocks);

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

  describe('getTeamsByCreator()', () => {
    const mockTeam = [
      {
        name: 'Avengers',
        creator: 'creatorId',
        description: 'this is a description',
        lead: 'leaderId',
        members: ['memberId'],
      },
    ] as ITeam[];

    describe('When teams is found successfully', () => {
      it('should return correct ITeam[]', async () => {
        const populate = jest.fn(() => mockTeam);
        const select = jest.fn(() => ({ populate }));
        jest.spyOn(teamModel, 'find').mockImplementation(() => ({ select }));

        const teams = await service.getTeamsByCreator('userId');

        expect(teams).toEqual(mockTeam);

        expect(teamModel.find).toBeCalledTimes(1);
        expect(teamModel.find).toBeCalledWith({ creator: 'userId' });

        expect(select).toBeCalledTimes(1);
        expect(select).toBeCalledWith(TeamPublicSelect);

        expect(populate).toBeCalledTimes(1);
        expect(populate).toBeCalledWith({
          path: 'creator lead members',
          model: User,
          select: UserPublicSelect,
        });
      });
    });
  });

  describe('getTeamsByLead()', () => {
    const mockTeam = [
      {
        name: 'Avengers',
        creator: 'creatorId',
        description: 'this is a description',
        lead: 'leaderId',
        members: ['memberId'],
      },
    ] as ITeam[];

    describe('When teams is found successfully', () => {
      it('should return correct ITeam[]', async () => {
        const populate = jest.fn(() => mockTeam);
        const select = jest.fn(() => ({ populate }));
        jest.spyOn(teamModel, 'find').mockImplementation(() => ({ select }));

        const teams = await service.getTeamsByLead('userId');

        expect(teams).toEqual(mockTeam);

        expect(teamModel.find).toBeCalledTimes(1);
        expect(teamModel.find).toBeCalledWith({ lead: 'userId' });

        expect(select).toBeCalledTimes(1);
        expect(select).toBeCalledWith(TeamPublicSelect);

        expect(populate).toBeCalledTimes(1);
        expect(populate).toBeCalledWith({
          path: 'creator lead members',
          model: User,
          select: UserPublicSelect,
        });
      });
    });
  });

  describe('getTeamsByMember()', () => {
    const mockTeam = [
      {
        name: 'Avengers',
        creator: 'creatorId',
        description: 'this is a description',
        lead: 'leaderId',
        members: ['memberId'],
      },
    ] as ITeam[];

    describe('When teams is found successfully', () => {
      it('should return correct ITeam[]', async () => {
        const populate = jest.fn(() => mockTeam);
        const select = jest.fn(() => ({ populate }));
        jest.spyOn(teamModel, 'find').mockImplementation(() => ({ select }));

        const teams = await service.getTeamsByMember('userId');

        expect(teams).toEqual(mockTeam);

        expect(teamModel.find).toBeCalledTimes(1);
        expect(teamModel.find).toBeCalledWith({ members: 'userId' });

        expect(select).toBeCalledTimes(1);
        expect(select).toBeCalledWith(TeamPublicSelect);

        expect(populate).toBeCalledTimes(1);
        expect(populate).toBeCalledWith({
          path: 'creator lead members',
          model: User,
          select: UserPublicSelect,
        });
      });
    });
  });

  describe('getTeamsByUserId()', () => {
    const mockTeams = {
      lead: [
        {
          name: 'Avengers',
          creator: 'creatorId',
          description: 'this is a description',
          lead: 'leaderId',
          members: ['memberId'],
        },
      ],
      created: [
        {
          name: 'Avengers',
          creator: 'creatorId',
          description: 'this is a description',
          lead: 'leaderId',
          members: ['memberId'],
        },
      ],
      member: [
        {
          name: 'Avengers',
          creator: 'creatorId',
          description: 'this is a description',
          lead: 'leaderId',
          members: ['memberId'],
        },
      ],
    } as GetTeamByUserIdReturn;

    describe('When team is found successfully', () => {
      it('should return correct teams', async () => {
        jest
          .spyOn(service, 'getTeamsByMember')
          .mockImplementation(async () => mockTeams.member);
        jest
          .spyOn(service, 'getTeamsByCreator')
          .mockImplementation(async () => mockTeams.member);
        jest
          .spyOn(service, 'getTeamsByLead')
          .mockImplementation(async () => mockTeams.member);

        const teams = await service.getTeamsByUserId('userId');

        expect(teams).toEqual(mockTeams);

        expect(service.getTeamsByMember).toBeCalledTimes(1);
        expect(service.getTeamsByMember).toBeCalledWith('userId');

        expect(service.getTeamsByLead).toBeCalledTimes(1);
        expect(service.getTeamsByLead).toBeCalledWith('userId');

        expect(service.getTeamsByCreator).toBeCalledTimes(1);
        expect(service.getTeamsByCreator).toBeCalledWith('userId');
      });
    });
  });
});
