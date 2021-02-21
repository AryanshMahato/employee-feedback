import { Test, TestingModule } from '@nestjs/testing';
import { TeamController } from './team.controller';
import { getModelToken } from '@nestjs/mongoose';
import { Team, TeamDocument } from './team.schema';
import { AuthModule } from '../auth/auth.module';
import {
  forwardRef,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';
import { TeamService } from './team.service';
import { TeamModelMock } from './team.mock';
import { UserModuleMock } from '../user/user.mock';
import { AuthService } from '../auth/auth.service';
import { JWTPayload } from '../auth/auth.types';
import { UserService } from '../user/user.service';
import { Request } from 'express';
import { CreateTeamRequestBody } from './team.validation';

describe('TeamController', () => {
  let controller: TeamController;
  let service: TeamService;
  let authService: AuthService;
  let userService: UserService;

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
    service = module.get<TeamService>(TeamService);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('createTeam()', () => {
    const mockJwtPayload: JWTPayload = {
      exp: 3600,
      iat: 3600,
      tokenType: 'Bearer',
      userId: 'userId',
    };

    const mockTeam = {
      id: 'teamId',
    } as TeamDocument;

    describe('When team is created successfully', () => {
      it('should return correct teamId and success message', async () => {
        const requestMock = {
          headers: {
            authorization: 'Bearer token',
          },
        } as Request;

        const requestBodyMock = {} as CreateTeamRequestBody;

        const mockService = jest
          .spyOn(service, 'createTeam')
          .mockImplementation(async () => mockTeam);

        const mockAuthService = jest
          .spyOn(authService, 'getUserFromToken')
          .mockImplementation(() => mockJwtPayload);

        const mockUserService = jest
          .spyOn(userService, 'addTeamToOwnedTeams')
          .mockImplementation(async () => {});

        const response = await controller.createTeam(
          requestMock,
          requestBodyMock,
        );

        expect(response).toEqual({
          id: mockTeam.id,
          message: 'team created successfully',
        });

        expect(mockAuthService).toBeCalledTimes(1);
        expect(mockService).toBeCalledTimes(1);
        expect(mockUserService).toBeCalledTimes(1);
      });
    });

    describe('When token is not bearer token', () => {
      it('should throw UnauthorizedException', async () => {
        const requestMock = {
          headers: {
            authorization: 'Bearer token',
          },
        } as Request;

        const requestBodyMock = {} as CreateTeamRequestBody;

        jest
          .spyOn(service, 'createTeam')
          .mockImplementation(async () => mockTeam);

        jest.spyOn(authService, 'getUserFromToken').mockImplementation(() => {
          throw new UnauthorizedException();
        });

        jest
          .spyOn(userService, 'addTeamToOwnedTeams')
          .mockImplementation(async () => {});

        try {
          await controller.createTeam(requestMock, requestBodyMock);
          expect('This line not to be executed').toBeFalsy();
        } catch (e) {
          expect(e).toBeInstanceOf(UnauthorizedException);
        }
      });
    });

    describe('When team creation fails', () => {
      it('should throw InternalServerErrorException', async () => {
        const requestMock = {
          headers: {
            authorization: 'Bearer token',
          },
        } as Request;

        const requestBodyMock = {} as CreateTeamRequestBody;

        jest.spyOn(service, 'createTeam').mockImplementation(async () => {
          throw new InternalServerErrorException();
        });

        jest
          .spyOn(authService, 'getUserFromToken')
          .mockImplementation(() => mockJwtPayload);

        jest
          .spyOn(userService, 'addTeamToOwnedTeams')
          .mockImplementation(async () => {});

        try {
          await controller.createTeam(requestMock, requestBodyMock);
          expect('This line not to be executed').toBeFalsy();
        } catch (e) {
          expect(e).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });

    describe('When team is failed to be added in owned teams', () => {
      it('should throw InternalServerErrorException', async () => {
        const requestMock = {
          headers: {
            authorization: 'Bearer token',
          },
        } as Request;

        const requestBodyMock = {} as CreateTeamRequestBody;

        jest
          .spyOn(service, 'createTeam')
          .mockImplementation(async () => mockTeam);

        jest
          .spyOn(authService, 'getUserFromToken')
          .mockImplementation(() => mockJwtPayload);

        jest
          .spyOn(userService, 'addTeamToOwnedTeams')
          .mockImplementation(async () => {
            throw new InternalServerErrorException();
          });

        try {
          await controller.createTeam(requestMock, requestBodyMock);
          expect('This line not to be executed').toBeFalsy();
        } catch (e) {
          expect(e).toBeInstanceOf(InternalServerErrorException);
        }
      });
    });
  });
});
