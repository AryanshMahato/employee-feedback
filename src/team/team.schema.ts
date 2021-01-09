import * as mongoose from 'mongoose';

import { Prop, Schema } from '@nestjs/mongoose';
import { User } from '../user/user.schema';

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
