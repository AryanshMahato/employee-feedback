import { IsNotEmpty, IsString } from 'class-validator';

export class SendInvitationRequestBody {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  teamId: string;
}
