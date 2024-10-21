import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MediaDocument = Media & Document;

@Schema()
export class Media {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  base64String: string;

  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  type: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
