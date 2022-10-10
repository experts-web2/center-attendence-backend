import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: false, required: false })
  phoneNumber: string;

  @Prop({ required: false })
  password: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'City' }])
  city: string;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Center' }])
  center: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: false })
  status: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: false })
  deleted: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
