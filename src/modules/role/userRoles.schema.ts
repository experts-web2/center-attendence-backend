import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class userRoles {
  @Prop({ required: true })
  role: string;

  @Prop({ required: false, default: true })
  active: boolean;
}

export type userRolesDocument = userRoles & Document;

export const userRolesSchema = SchemaFactory.createForClass(userRoles);
