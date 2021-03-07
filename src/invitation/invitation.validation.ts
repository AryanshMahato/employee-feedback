import { IsNotEmpty } from 'class-validator';

export class SendInvitationRequestBody {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  teamId: string;
}
