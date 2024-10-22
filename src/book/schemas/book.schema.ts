import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Author } from 'src/author/schemas/author.schema';
import { Genre } from 'src/genre/schemas/genre.schema';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Author', required: true })
  author: Author;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Genre', required: true })
  genre: Genre;

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
