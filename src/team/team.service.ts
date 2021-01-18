import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamDocument } from './team.schema';
import { GetTeamByUserIdReturn, ITeam } from './team.types';

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

  getTeamsByCreator = async (userId: string): Promise<ITeam[]> => {
    return [
      {
        creator: 'creator',
        lead: 'lead',
        name: 'name',
        members: ['name'],
        description: 'description',
      },
    ];
  };

  getTeamsByLead = async (userId: string): Promise<ITeam[]> => {
    return [
      {
        creator: 'creator',
        lead: 'lead',
        name: 'name',
        members: ['name'],
        description: 'description',
      },
    ];
  };

  getTeamsByMember = async (userId: string): Promise<ITeam[]> => {
    return [
      {
        creator: 'creator',
        lead: 'lead',
        name: 'name',
        members: ['name'],
        description: 'description',
      },
    ];
  };

  getTeamsByUserId = async (userId: string): Promise<GetTeamByUserIdReturn> => {
    return {
      created: [
        {
          creator: 'creator',
          lead: 'lead',
          name: 'name',
          members: ['name'],
          description: 'description',
        },
      ],
      lead: [
        {
          creator: 'creator',
          lead: 'lead',
          name: 'name',
          members: ['name'],
          description: 'description',
        },
      ],
      member: [
        {
          creator: 'creator',
          lead: 'lead',
          name: 'name',
          members: ['name'],
          description: 'description',
        },
      ],
    };
  };
}
