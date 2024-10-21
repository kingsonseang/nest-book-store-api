import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/pagination';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    private readonly mediaService: MediaService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const { title, author, cover } = createBookDto;

    const existingBook = await this.bookModel.findOne({ title, author }).exec();

    if (existingBook) {
      throw new BadRequestException(
        `A book with the title "${title}" by author "${author}" already exists.`,
      );
    }

    const bookToCreate: Book = { ...createBookDto, cover: '' };

    if (cover) {
      const media = await this.mediaService.create(cover);
      bookToCreate.cover = media.filename;
    }

    const newBook = new this.bookModel(bookToCreate);
    return newBook.save();
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Book>> {
    const books = await this.bookModel
      .find()
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take)
      .exec();

    const itemCount = await this.bookModel.countDocuments().exec();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(books, pageMetaDto);
  }

  async findById(id: string): Promise<Book> {
    return await this.bookModel.findById(id).exec();
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    return await this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .exec();
  }

  async delete(id: string) {
    await this.bookModel.findByIdAndDelete(id).exec();
  } // do try catch

  async search(
    query: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Book>> {
    // Validate query string
    if (!query) {
      throw new BadRequestException('Query string must not be empty');
    }

    // Find books that match the search query
    const books = await this.bookModel
      .find(
        {
          $text: { $search: query },
        },
        {
          score: { $meta: 'textScore' },
        },
      )
      .sort({ score: { $meta: 'textScore' } })
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take)
      .exec();

    const itemCount = await this.bookModel.countDocuments({
      $text: { $search: query },
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(books, pageMetaDto);
  } // Full-text search using MongoDB's text indexes
}
