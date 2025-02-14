import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GenreService } from './genre.service';
import { Genre, GenreSchema } from './schemas/genre.schema';
import { GenreController } from './genre.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
  ],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService],
})
export class GenreModule {}
