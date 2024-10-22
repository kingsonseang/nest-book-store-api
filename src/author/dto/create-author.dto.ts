import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({
    description: "Author's full name",
    example: 'Lee Min',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: "Author's biography",
    example: 'Lee Min is a doctor who...',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: "Author's birthdate",
    example: '1980-05-12',
    required: false,
    type: 'string',
    format: 'date',
  })
  @IsOptional()
  @IsDate()
  birthdate?: Date;

  @ApiProperty({
    description: "Author's nationality",
    example: 'South Korean',
    required: false,
  })
  @IsOptional()
  @IsString()
  nationality?: string;
}
