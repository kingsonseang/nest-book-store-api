import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book, BookSchema } from './schemas/book.schema'; // Import Book schema
import { MediaModule } from 'src/media/media.module';
import { AuthorModule } from 'src/author/author.module';
import { GenreModule } from 'src/genre/genre.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    MediaModule,
    AuthorModule,
    GenreModule,
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
