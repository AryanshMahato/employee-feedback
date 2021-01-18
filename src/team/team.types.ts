import { Team } from './team.schema';

export type ITeam = Team;

export interface CreateTeamResponse {
  message: string;
  id: string;
}

export type GetTeamMethods = 'created' | 'lead' | 'member' | '';

export type GetTeamResponse = ITeam[] | GetTeamByUserIdReturn;

export interface GetTeamByUserIdReturn {
  created: ITeam[];
  lead: ITeam[];
  member: ITeam[];
}
