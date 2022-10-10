import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Center {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'City' })
  city: string;

  @Prop({
    required: true,
    default: [],
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
  })
  managers: string[];
}

export type CenterDocument = Center & Document;

export const CenterSchema = SchemaFactory.createForClass(Center);
