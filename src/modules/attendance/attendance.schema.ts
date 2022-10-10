// import * as mongoose from 'mongoose';
// import { Schema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
@Schema()
export class Multiple {
  @Prop()
  name: string;
}
// Generate a Mongoose Schema before use as Subdocument
const MultipleSchema = SchemaFactory.createForClass(Multiple);

@Schema()
export class Attendance {
  @Prop({ required: true })
  newMembers: number;

  @Prop({ required: true })
  employees: number;

  @Prop({ required: true })
  nonEmployees: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'City' })
  city: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Center' })
  center: string;

  @Prop({ required: true })
  cityManager: [];

  @Prop({ required: true })
  centerManager: [];

  @Prop({ default: Date.now() })
  date: Date;
}

export type AttendanceDocument = Attendance & Document;

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
