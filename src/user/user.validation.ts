import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { GetUserMethods } from './user.types';
import {
  NoSpaceAndSpecialCharacterRegex,
  NoSpecialCharacterRegex,
  UserOperationMethods,
} from '../constants/Regex';
import { Match } from '../Decorators/Valdators/match.decorator';

export class GetUserValidationParams {
  @IsNotEmpty()
  userId: string;
}

export class GetUserValidationQuery {
  @IsNotEmpty()
  @Matches(UserOperationMethods, {
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
  @Matches(NoSpaceAndSpecialCharacterRegex, {
    message: 'no special characters or space allowed in username',
  })
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

export class SignInRequestBody {
  @IsString()
  @IsOptional({
    groups: ['email'],
  })
  @Matches(NoSpaceAndSpecialCharacterRegex, {
    message: 'no special characters or space allowed in username',
  })
  username: string;

  @IsString()
  @IsEmail()
  @IsOptional({
    groups: ['username'],
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(5)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Matches(UserOperationMethods, {
    message: 'method must be username or email',
  })
  type: 'username' | 'email';
}

export class GenerateAccessTokenRequestParams {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  userId: string;
}

export class GenerateAccessTokenRequestQuery {
  @IsString()
  @Matches(UserOperationMethods, {
    message: 'method must be username or email',
  })
  method: 'username' | 'email';
}
