import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamResponse, GetTeamResponse } from './team.types';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { CreateTeamRequestBody, GetTeamsQuery } from './team.validation';

@Controller()
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('team')
  @UseGuards(AuthGuard)
  async createTeam(
    @Req() req: Request,
    @Body() body: CreateTeamRequestBody,
  ): Promise<CreateTeamResponse> {
    const userId = this.authService.getUserFromToken(req.headers.authorization)
      .userId;

    const team = await this.teamService.createTeam({
      name: body.name,
      description: body.description,
      lead: userId,
      creator: userId,
    });

    await this.userService.addTeamToOwnedTeams(userId, team.id);

    return {
      id: team.id,
      message: 'team created successfully',
    };
  }

  @Get('teams')
  @UseGuards(AuthGuard)
  async getTeams(
    @Req() _req: Request,
    @Query() _query: GetTeamsQuery,
  ): Promise<GetTeamResponse> {
    // const {userId} = this.authService.getUserFromToken(req.headers.authorization);

    return [
      {
        creator: 'creator',
        lead: 'lead',
        name: 'name',
        members: ['name'],
        description: 'description',
      },
    ];
  }
}
