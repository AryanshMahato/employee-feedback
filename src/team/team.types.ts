import { Team } from './team.schema';

export type ITeam = Team;

export type CreateTeamRequest = Omit<ITeam, 'members' | 'creator' | 'lead'>;

export interface CreateTeamResponse {
  message: string;
  id: string;
}
