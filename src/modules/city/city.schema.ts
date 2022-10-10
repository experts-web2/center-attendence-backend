import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class City {
  @Prop({ required: true })
  name: string;
}

export type CityDocument = City & Document;

export const CitySchema = SchemaFactory.createForClass(City);
