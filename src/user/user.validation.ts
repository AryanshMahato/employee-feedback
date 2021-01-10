import { IsNotEmpty, Matches } from 'class-validator';
import { GetUserMethods } from './user.types';

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
