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

describe('InvitationController', () => {
  let controller: InvitationController;
  let service: InvitationService;
  const invitationModel = new InvitationModel();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
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
  });
});
