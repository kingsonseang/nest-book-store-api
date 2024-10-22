import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGenreDto {
  @ApiProperty({
    description: 'Name of the genre',
    example: 'Romance',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the genre',
    example: 'Romance genre focuses on relationships...',
    required: false,
    type: 'string',
  })
  @IsString()
  description?: string;
}
