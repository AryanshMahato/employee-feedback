import { Test } from '@nestjs/testing';
import { UserService } from './user.service';

export class UserModelMock {}

export class UserServiceMock {}

export const UserModuleMock = Test.createTestingModule({
  providers: [{ provide: UserService.name, useClass: UserServiceMock }],
  exports: [{ provide: UserService.name, useClass: UserServiceMock }],
});