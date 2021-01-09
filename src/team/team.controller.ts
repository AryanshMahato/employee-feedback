import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamRequest, CreateTeamResponse } from './team.types';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { Request as ExpressRequest } from 'express';

@Controller()
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly authService: AuthService,
  ) {}

  @Post('team')
  @UseGuards(AuthGuard)
  async createTeam(
    @Request() req: ExpressRequest,
    @Body() body: CreateTeamRequest,
  ): Promise<CreateTeamResponse> {
    const username = this.authService.getUserFromToken(
      req.headers.authorization,
    ).username;

    const team = await this.teamService.createTeam({
      name: body.name,
      description: body.description,
      lead: username,
      creator: username,
    });

    return {
      id: team.id,
      message: 'team created successfully',
    };
  }
}
