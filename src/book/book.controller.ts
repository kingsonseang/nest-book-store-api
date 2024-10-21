import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiBody, ApiTags, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiPaginatedResponse } from 'src/common/pagination/page.decorator';
import { Book } from './schemas/book.schema';
import { PageOptionsDto } from 'src/common/pagination';

@ApiTags('Book')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('cover'))
  create(
    @Body() createBookDto: CreateBookDto,
    @UploadedFile() cover: Express.Multer.File,
  ) {
    createBookDto.cover = cover;
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiPaginatedResponse(Book)
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.bookService.findAll(pageOptionsDto);
  }

  @Get('search')
  @ApiPaginatedResponse(Book)
  async search(
    @Query('query') query: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return await this.bookService.search(query, pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.bookService.delete(id);
  }
}
