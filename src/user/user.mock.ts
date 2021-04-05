import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserDocument } from './user.schema';
import { GetUserOptions, SignUpRequest } from './user.types';

export class UserModelMock {
  create = async (): Promise<unknown> => {
    return;
  };

  findOne = (): unknown => {
    return;
  };

  findByIdAndUpdate = (): unknown => {
    return;
  };

  findById = (): unknown => {
    return;
  };
}

export class UserServiceMock {
  addTeamToOwnedTeams(_userId: string, _teamId: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  getUser(
    _userId: string,
    _method: 'username' | 'email',
    _options: GetUserOptions | undefined,
  ): Promise<UserDocument | null | undefined> {
    return Promise.resolve(undefined);
  }

  private getUserByEmail(
    _email: string,
    _withPassword: boolean | undefined,
  ): Promise<UserDocument> {
    return Promise.resolve(undefined);
  }

  private getUserByUsername(
    _username: string,
    _withPassword: boolean | undefined,
  ): Promise<UserDocument> {
    return Promise.resolve(undefined);
  }

  signUp(_userData: Omit<SignUpRequest, 'confirmPassword'>): Promise<string> {
    return Promise.resolve('');
  }

  getUserById = async (_id: string): Promise<UserDocument> => {
    return Promise.resolve({} as UserDocument);
  };
}

export const UserModuleMock = Test.createTestingModule({
  providers: [{ provide: UserService.name, useClass: UserServiceMock }],
  exports: [{ provide: UserService.name, useClass: UserServiceMock }],
});
