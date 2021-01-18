import { Test } from '@nestjs/testing';
import { TeamService } from './team.service';

export class TeamModelMock {}

export class TeamServiceMock {}

export const TeamModuleMock = Test.createTestingModule({
  providers: [{ provide: TeamService.name, useClass: TeamServiceMock }],
  exports: [{ provide: TeamService.name, useClass: TeamServiceMock }],
});
