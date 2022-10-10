import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Attendance } from '../attendance/attendance.schema';

@Schema()
export class Password {
  @Prop({ required: true })
  email: any;
}

export type PasswordDocument = Password & Document;

export const PasswordSchema = SchemaFactory.createForClass(Password);
