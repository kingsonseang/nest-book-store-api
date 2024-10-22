// src/author/schemas/author.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Author extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  bio?: string;

  @Prop()
  birthdate?: Date;

  @Prop()
  nationality?: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
