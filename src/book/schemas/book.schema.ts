import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  genre: string;

  @Prop()
  description: string;

  @Prop({ required: true, parseFloat: true })
  price: number;

  @Prop({ default: 0, max: 5 })
  rating: number;

  @Prop({ required: true })
  cover: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.index({ title: 'text', author: 'text', genre: 'text' }); // index on title, author and genre for full text search
