import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { GetUserMethods } from './user.types';
import { NoSpecialCharacterRegex } from '../constants/Regex';
import { Match } from '../Decorators/Valdators/match.decorator';

export class GetUserValidationParams {
  @IsNotEmpty()
  userId: string;
}

export class GetUserValidationQuery {
  @IsNotEmpty()
  @Matches(new RegExp(`^\\busername\\b|\\bemail\\b$`), {
    message: 'method must be username or email',
  })
  method: GetUserMethods;
}

export class SignUpRequestBody {
  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  @Matches(NoSpecialCharacterRegex, {
    message: 'no special characters allowed in firstName',
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  @Matches(NoSpecialCharacterRegex, {
    message: 'no special characters allowed in lastName',
  })
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 32)
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(2, 32)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(5)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(5)
  @Match('password', { message: 'password and confirmPassword should be same' })
  confirmPassword: string;
}
