import { Test, TestingModule } from '@nestjs/testing';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import { getModelToken } from '@nestjs/mongoose';
import { Invitation } from './invitation.schema';
import { InvitationModel } from './invitation.mock';
import { Request } from 'express';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';
import { UserModuleMock } from '../user/user.mock';
import { TeamModuleMock } from '../team/team.mock';
import {
  forwardRef,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TeamService } from '../team/team.service';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/user.schema';
import { TeamDocument } from '../team/team.schema';

describe('InvitationController', () => {
  let controller: InvitationController;
  let service: InvitationService;
  let teamService: TeamService;
  let userService: UserService;

  const invitationModel = new InvitationModel();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        forwardRef(() => UserModuleMock),
        forwardRef(() => TeamModuleMock),
        AuthModule,
        JwtModule.register({
          secret: EnvConfig.jwtSecret,
        }),
      ],
      controllers: [InvitationController],
      providers: [
        InvitationService,
        { provide: getModelToken(Invitation.name), useValue: invitationModel },
      ],
    }).compile();

    controller = module.get<InvitationController>(InvitationController);
    service = module.get<InvitationService>(InvitationService);
    userService = await module.get<UserService>(UserService);
    teamService = await module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(teamService).toBeDefined();
  });

  describe('sendInvitation', () => {
    describe('When invitation is sent successfully', () => {
      it('should send the invitation without throwing any errors', async () => {
        const requestMock = {
          headers: { authorization: 'Bearer token' },
          body: {
            teamId: 'teamId',
            userId: 'userId',
          },
        } as Request;

        jest
          .spyOn(service, 'sendInvite')
          .mockImplementation(async () => 'invitationId');

        jest
          .spyOn(userService, 'getUserById')
          .mockImplementation(async () => ({} as UserDocument));

        jest
          .spyOn(teamService, 'getTeamById')
          .mockImplementation(
            async () => ({ creator: 'userId' } as TeamDocument),
          );

        const response = await controller.sendInvitation(
          requestMock,
          requestMock.body,
        );

        expect(response).toEqual({ id: 'invitationId' });

        expect(service.sendInvite).toBeCalledTimes(1);
        expect(service.sendInvite).toBeCalledWith(
          requestMock.body.userId,
          requestMock.body.teamId,
        );
      });
    });

    describe('When user is not found', () => {
      it('should throw NotFoundException', async () => {
        const requestMock = {
          headers: { authorization: 'Bearer token' },
          body: {
            teamId: 'teamId',
            userId: 'userId',
          },
        } as Request;

        jest
          .spyOn(service, 'sendInvite')
          .mockImplementation(async () => 'invitationId');

        jest
          .spyOn(userService, 'getUserById')
          .mockImplementation(async () => null);

        jest
          .spyOn(teamService, 'getTeamById')
          .mockImplementation(
            async () => ({ creator: 'userId' } as TeamDocument),
          );

        try {
          await controller.sendInvitation(requestMock, requestMock.body);
          expect('This line not to be executed').toBeFalsy();
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e.message).toBe('user not found');
        }
      });
    });

    describe('When team is not found', () => {
      it('should throw NotFoundException', async () => {
        const requestMock = {
          headers: { authorization: 'Bearer token' },
          body: {
            teamId: 'teamId',
            userId: 'userId',
          },
        } as Request;

        jest
          .spyOn(service, 'sendInvite')
          .mockImplementation(async () => 'invitationId');

        jest
          .spyOn(userService, 'getUserById')
          .mockImplementation(async () => ({} as UserDocument));

        jest
          .spyOn(teamService, 'getTeamById')
          .mockImplementation(async () => null);

        try {
          await controller.sendInvitation(requestMock, requestMock.body);
          expect('This line not to be executed').toBeFalsy();
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e.message).toBe('team not found');
        }
      });
    });

    describe('When user is not team creator or team lead', () => {
      it('should not send the invitation and throw UnauthorizedException', async () => {
        const requestMock = {
          headers: { authorization: 'Bearer token' },
          body: {
            teamId: 'teamId',
            userId: 'userId',
          },
        } as Request;

        jest
          .spyOn(service, 'sendInvite')
          .mockImplementation(async () => 'invitationId');

        jest
          .spyOn(userService, 'getUserById')
          .mockImplementation(async () => ({} as UserDocument));

        jest.spyOn(teamService, 'getTeamById').mockImplementation(
          async () =>
            ({
              creator: 'differentUserId',
              lead: 'differentUserId',
            } as TeamDocument),
        );

        try {
          await controller.sendInvitation(requestMock, requestMock.body);
          expect('This line not to be executed').toBeFalsy();
        } catch (e) {
          expect(e).toBeInstanceOf(UnauthorizedException);
        }
      });
    });
  });
});
