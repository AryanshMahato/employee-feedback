import * as mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import { Document } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema()
export class Team {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  creator: string;

  @Prop({
    required: true,
    trim: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  })
  lead: User;

  @Prop({
    required: true,
    trim: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  })
  members: User[];

  @Prop({ required: true, trim: true })
  description: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
