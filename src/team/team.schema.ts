import * as mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import { Document } from 'mongoose';

export type TeamDocument = Team & Document;

export const TeamPublicSelect =
  '_id name description lead creator members updatedAt createdAt';

@Schema({
  timestamps: true,
})
export class Team {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    trim: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  creator: User | string;

  @Prop({
    required: true,
    trim: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  lead: User | string;

  @Prop({
    required: true,
    trim: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  })
  members: User[] | string[];

  @Prop({ required: true, trim: true })
  description: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
