import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBookDto {
  @ApiProperty({
    description: 'Book title',
    example: 'A cold summer night',
    required: true,
  })
  title: string;

  @ApiProperty({
    description: 'ID of the book author',
    example: '669cde67e4a5fa0ebe14a58b',
  })
  @IsNotEmpty()
  author: Types.ObjectId;

  @ApiProperty({
    description: 'Genre of the book (ObjectId reference to Genre)',
    example: '614b1b3e4d7eeb001c09c9b8',
    required: true,
  })
  @IsNotEmpty()
  genre: Types.ObjectId;

  @ApiProperty({
    description: 'Genre of the book',
    example:
      "It was a beautiful winters night, and it was as cold as it had been on the first day i met her, she was more beautiful than the bright moon in the sky. I only wish i could go back and fix my past mistakes... If only i could maybe... No one would be hurt and she would still be here... I'm sorry cao cao",
    required: false,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Price of the book in Dollar',
    example: 53.29,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Book rating',
    example: 4.5,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @ApiProperty({
    description: 'Book cover',
    type: 'string',
    format: 'binary',
    required: true,
  })
  cover: Express.Multer.File;
}
