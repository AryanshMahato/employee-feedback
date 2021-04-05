import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  AcceptInvitationResponse,
  GetInvitationsResponse,
  SendInvitationResponse,
} from './invitation.types';
import { InvitationService } from './invitation.service';
import { Request } from 'express';
import {
  AcceptInvitationsParam,
  SendInvitationRequestBody,
} from './invitation.validation';
import { AuthGuard } from '../auth/auth.guard';
import { TeamService } from '../team/team.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

@Controller()
export class InvitationController {
  constructor(
    private readonly invitationService: InvitationService,
    private readonly teamService: TeamService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
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

  @Get('invitations')
  @UseGuards(AuthGuard)
  async getInvitations(@Req() req: Request): Promise<GetInvitationsResponse> {
    const { userId } = this.authService.getUserFromToken(
      req.headers.authorization,
    );

    const invitations = await this.invitationService.getInvitationsByUserId(
      userId,
    );

    return {
      invitations,
    };
  }

  @Patch('invitations/:invitationId/accept')
  @UseGuards(AuthGuard)
  async acceptInvitation(
    @Req() req: Request,
    @Param() param: AcceptInvitationsParam,
  ): Promise<AcceptInvitationResponse> {
    const { userId } = this.authService.getUserFromToken(
      req.headers.authorization,
    );

    const invitation = await this.invitationService.getInvitation(
      param.invitationId,
      userId,
    );

    if (!invitation) {
      throw new NotFoundException('invitation not found');
    }

    await this.invitationService.acceptInvitation(param.invitationId);

    return {
      message: 'Invitation accepted',
    };
  }
}
