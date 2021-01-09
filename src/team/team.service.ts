import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamDocument } from './team.schema';
import { ITeam } from './team.types';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<TeamDocument>,
  ) {}

  createTeam = async (
    teamData: Omit<ITeam, 'members'>,
  ): Promise<TeamDocument> => {
    const team = new this.teamModel({ ...teamData } as Team);
    await team.save();

    return team;
  };

  getTeamByCreatorId = async (creatorId: string): Promise<TeamDocument[]> => {
    return this.teamModel.find({ creator: creatorId }).populate('lead');
  };
}
