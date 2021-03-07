import { Test, TestingModule } from '@nestjs/testing';
import { InvitationService } from './invitation.service';
import { getModelToken } from '@nestjs/mongoose';
import { Invitation } from './invitation.schema';
import { InvitationModel } from './invitation.mock';

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
  });
});
