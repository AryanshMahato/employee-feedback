import { Test, TestingModule } from '@nestjs/testing';
import { InvitationService } from './invitation.service';
import { getModelToken } from '@nestjs/mongoose';
import { Invitation } from './invitation.schema';
import { InvitationModel } from './invitation.mock';
import { AssertionError } from 'assert';
import { TInvitation } from './invitation.types';

describe('InvitationService', () => {
  let service: InvitationService;
  const invitationModel = new InvitationModel();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        { provide: getModelToken(Invitation.name), useValue: invitationModel },
        InvitationService,
      ],
    }).compile();

    service = module.get<InvitationService>(InvitationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(invitationModel).toBeDefined();
  });

  describe('sendInvite', () => {
    describe('When invitation is created successfully', () => {
      it('should return correct id', async () => {
        jest
          .spyOn(invitationModel, 'create')
          .mockImplementation(() => ({ id: 'invitationId' }));

        const invitationId = await service.sendInvite('userId', 'teamId');

        expect(invitationId).toBe('invitationId');
      });
    });

    describe('When invitation creation is failed', () => {
      it('should throw error', async () => {
        jest.spyOn(invitationModel, 'create').mockImplementation(() => {
          throw new Error();
        });

        try {
          await service.sendInvite('userId', 'teamId');
          expect('This line not to be executed').toBeFalsy();
        } catch (e) {
          expect(e).not.toBeInstanceOf(AssertionError);
        }
      });
    });
  });

  describe('getInvitationsByUserId', () => {
    describe('When invitations are found successfully', () => {
      it('should return product invitations', async () => {
        const exec = jest.fn(
          () =>
            [
              {
                accepted: false,
                deleted: false,
                rejected: false,
                team: 'team',
                user: 'user',
              },
            ] as TInvitation[],
        );
        const select = jest.fn(() => {
          return { exec };
        });
        const populate = jest.fn(() => {
          return { select };
        });
        const find = jest.fn(() => {
          return { populate };
        });

        jest.spyOn(invitationModel, 'find').mockImplementation(find);

        const invitations = await service.getInvitationsByUserId('userId');

        expect(invitations).toEqual([
          {
            accepted: false,
            deleted: false,
            rejected: false,
            team: 'team',
            user: 'user',
          },
        ] as TInvitation[]);
      });
    });
  });
});
