import * as mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import { Team } from '../team/team.schema';
import { Document } from 'mongoose';

export type InvitationDocument = Invitation & Document;

@Schema({
  timestamps: true,
})
export class Invitation {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: User | string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Team.name,
  })
  team: Team | string;

  @Prop({
    required: true,
    default: false,
  })
  accepted: boolean;

  @Prop({
    required: true,
    default: false,
  })
  rejected: boolean;

  @Prop({
    required: true,
    default: false,
  })
  deleted: boolean;
}
export const InvitationSchema = SchemaFactory.createForClass(Invitation);
