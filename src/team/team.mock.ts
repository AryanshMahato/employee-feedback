import { Test } from '@nestjs/testing';
import { TeamService } from './team.service';
import { TeamDocument } from './team.schema';

export class TeamModelMock {
  create(): void {
    return;
  }

  find(): unknown {
    return;
  }

  findByIdAndDelete(): void {
    return;
  }

  findByIdAndUpdate(): void {
    return;
  }

  findById(): unknown {
    return;
  }
}

export class TeamServiceMock {
  getTeamById = async (id: string): Promise<TeamDocument> => {
    return Promise.resolve({} as TeamDocument);
  };
}

export const TeamModuleMock = Test.createTestingModule({
  providers: [{ provide: TeamService.name, useClass: TeamServiceMock }],
  exports: [{ provide: TeamService.name, useClass: TeamServiceMock }],
});
