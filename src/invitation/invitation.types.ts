import { Invitation } from './invitation.schema';

export type TInvitation = Invitation;

export class SendInvitationResponse {
  id: string;
}

export class GetInvitationsResponse {
  invitations: TInvitation[];
}

export class AcceptInvitationResponse {
  message: string;
}
