import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { NoSpecialCharacterRegex } from '../constants/Regex';

export class CreateTeamRequestBody {
  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  @Matches(NoSpecialCharacterRegex, {
    message: 'no special characters allowed in name',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 256)
  description: string;
}
