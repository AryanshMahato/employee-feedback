import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import {
  GetTeamMethodsRegex,
  NoSpecialCharacterRegex,
} from '../constants/Regex';
import { GetTeamMethods } from './team.types';

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

export class GetTeamsQuery {
  @IsOptional()
  @Matches(GetTeamMethodsRegex, {
    message: 'invalid method',
  })
  method: GetTeamMethods;
}

export class DeleteTeamValidationParams {
  @IsNotEmpty()
  teamId: string;
}
