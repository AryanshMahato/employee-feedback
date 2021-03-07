import { Module } from '@nestjs/common';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InvitationSchema } from './invitation.schema';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfig } from '../config/EnvConfig';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InvitationModule.name, schema: InvitationSchema },
    ]),
    JwtModule.register({
      secret: EnvConfig.jwtSecret,
    }),
  ],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}
