import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamDocument, TeamPublicSelect } from './team.schema';
import { EditableTeamFields, GetTeamByUserIdReturn, ITeam } from './team.types';
import { User, UserPublicSelect } from '../user/user.schema';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<TeamDocument>,
  ) {}

  createTeam = async (
    teamData: Omit<ITeam, 'members'>,
  ): Promise<TeamDocument> => {
    return await this.teamModel.create({ ...teamData } as Team);
  };

  getTeamsByCreator = async (userId: string): Promise<ITeam[]> => {
    return this.teamModel
      .find({
        creator: userId,
      })
      .select(TeamPublicSelect)
      .populate({
        path: 'creator lead members',
        model: User,
        select: UserPublicSelect,
      });
  };

  getTeamsByLead = async (userId: string): Promise<ITeam[]> => {
    return this.teamModel
      .find({
        lead: userId,
      })
      .select(TeamPublicSelect)
      .populate({
        path: 'creator lead members',
        model: User,
        select: UserPublicSelect,
      });
  };

  getTeamsByMember = async (userId: string): Promise<ITeam[]> => {
    return this.teamModel
      .find({
        members: userId,
      })
      .select(TeamPublicSelect)
      .populate({
        path: 'creator lead members',
        model: User,
        select: UserPublicSelect,
      });
  };

  getTeamsByUserId = async (userId: string): Promise<GetTeamByUserIdReturn> => {
    return {
      created: await this.getTeamsByCreator(userId),
      lead: await this.getTeamsByLead(userId),
      member: await this.getTeamsByMember(userId),
    };
  };

  isTeamOwner = async (userId: string, teamId: string): Promise<boolean> => {
    const team = await this.teamModel.findById(teamId);
    return team.creator.toString() === userId;
  };

  deleteTeam = async (teamID: string): Promise<void> => {
    await this.teamModel.findByIdAndDelete(teamID);
  };

  updateTeam = async (
    teamId: string,
    updatedTeam: EditableTeamFields,
  ): Promise<void> => {
    await this.teamModel.findByIdAndUpdate(teamId, {
      name: updatedTeam.name,
      description: updatedTeam.description,
    });
  };

  getTeamById = async (id: string): Promise<TeamDocument> => {
    return this.teamModel.findById(id);
  };
}
