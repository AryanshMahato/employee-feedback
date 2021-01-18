import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamResponse } from './team.types';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { CreateTeamRequestBody } from './team.validation';

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
}
