import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    description: 'Book title',
    example: 'A cold summer night',
    required: true,
  })
  title: string;

  @ApiProperty({
    description: 'Author of the book',
    example: 'Lee Min Jee',
  })
  author: string;

  @ApiProperty({
    description: 'Genre ofi the book',
    example: 'Romance',
  })
  genre: string;

  @ApiProperty({
    description: 'Genre of the book',
    example:
      "It was a beautiful winters night, and it was as cold as it had been on the first day i met her, she was more beautiful than the bright moon in the sky. I only wish i could go back and fix my past mistakes... If only i could maybe... No one would be hurt and she would still be here... I'm sorry cao cao",
    required: false,
  })
  description: string;

  @ApiProperty({
    description: 'Price of the book in Dollar',
    example: 53.29,
    required: true,
  })
  price: number;

  @ApiProperty({
    description: 'Book rating',
    example: 4.5,
    required: true,
  })
  rating: number;

  @ApiProperty({
    description: 'Book cover',
    type: 'string',
    format: 'binary',
    required: true,
  })
  cover: Express.Multer.File;
}
