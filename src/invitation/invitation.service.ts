import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invitation, InvitationDocument } from './invitation.schema';

@Injectable()
export class InvitationService {
  constructor(
    @InjectModel(Invitation.name)
    private readonly invitationModel: Model<InvitationDocument>,
  ) {}

  sendInvite = async (userId: string, teamId: string): Promise<string> => {
    const invitation = await this.invitationModel.create({
      user: userId,
      team: teamId,
      accepted: false,
      rejected: false,
      deleted: false,
    });

    return invitation.id;
  };
}
