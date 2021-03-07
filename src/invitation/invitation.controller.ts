import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SendInvitationResponse } from './invitation.types';
import { InvitationService } from './invitation.service';
import { Request } from 'express';
import { SendInvitationRequestBody } from './invitation.validation';
import { AuthGuard } from '../auth/auth.guard';

@Controller()
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post('invitation')
  @UseGuards(AuthGuard)
  async sendInvitation(
    @Req() req: Request,
    @Body() body: SendInvitationRequestBody,
  ): Promise<SendInvitationResponse> {
    // Verify if user is team owner or lead
    const invitationId = await this.invitationService.sendInvite(
      body.userId,
      body.teamId,
    );

    return {
      id: invitationId,
    };
  }
}
