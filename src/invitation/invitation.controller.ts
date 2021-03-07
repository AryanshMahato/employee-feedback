import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { SendInvitationResponse } from './invitation.types';
import { InvitationService } from './invitation.service';
import { Request } from 'express';
import { SendInvitationRequestBody } from './invitation.validation';
import { AuthGuard } from '../auth/auth.guard';
import { TeamService } from '../team/team.service';
import { UserService } from '../user/user.service';

@Controller()
export class InvitationController {
  constructor(
    private readonly invitationService: InvitationService,
    private readonly teamService: TeamService,
    private readonly userService: UserService,
  ) {}

  @Post('invitation')
  @UseGuards(AuthGuard)
  async sendInvitation(
    @Req() req: Request,
    @Body() body: SendInvitationRequestBody,
  ): Promise<SendInvitationResponse> {
    const user = await this.userService.getUserById(body.userId);
    if (!user) {
      throw new NotFoundException({ message: 'user not found' });
    }

    const team = await this.teamService.getTeamById(body.teamId);
    if (!team) {
      throw new NotFoundException({ message: 'team not found' });
    }

    // Verify if user is team owner or lead
    if (
      team.creator.toString() === body.userId ||
      team.lead.toString() === body.userId
    ) {
      const invitationId = await this.invitationService.sendInvite(
        body.userId,
        body.teamId,
      );

      return {
        id: invitationId,
      };
    }
    throw new UnauthorizedException('not authorized to invite new members');
  }
}
