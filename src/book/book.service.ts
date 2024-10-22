import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/pagination';
import { MediaService } from 'src/media/media.service';
import { Author } from 'src/author/schemas/author.schema';
import { Genre } from 'src/genre/schemas/genre.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @InjectModel(Author.name) private authorModel: Model<Author>,
    @InjectModel(Genre.name) private genreModel: Model<Genre>,
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

    const bookToCreate: any = { ...createBookDto, cover: '' };

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
      .populate('author')
      .populate('genre')
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take)
      .exec();

    const itemCount = await this.bookModel.countDocuments().exec();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(books, pageMetaDto);
  }

  async findById(id: string): Promise<Book> {
    return await this.bookModel
      .findById(id)
      .populate('author')
      .populate('genre')
      .exec();
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
    pageOptionsDto: PageOptionsDto,
    query: string,
    author?: string,
    genre?: string,
  ): Promise<PageDto<Book>> {
    // Validate query string
    if (!query && !author && !genre) {
      throw new BadRequestException(
        'At least one search or filter parameter must be provided',
      );
    }

    // Create a base search filter
    const searchFilter: any = {};

    // If query is provided, perform full-text search on book fields
    if (query) {
      searchFilter.$text = { $search: query };
    }

    // Add filters for author if it is provided
    if (author) {
      // Find the author by name
      const authorDoc = await this.authorModel.findOne({ name: author }).exec();
      if (!authorDoc) {
        throw new NotFoundException('Author not found');
      }
      searchFilter.author = authorDoc._id;
    }

    // Add filters for genre if it is provided
    if (genre) {
      // Find the genre by name
      const genreDoc = await this.genreModel.findOne({ name: genre }).exec();
      if (!genreDoc) {
        throw new NotFoundException('Genre not found');
      }
      searchFilter.genre = genreDoc._id;
    }

    // Perform search with the constructed filter
    const books = await this.bookModel
      .find(
        searchFilter,
        query ? { score: { $meta: 'textScore' } } : {}, // Only include textScore if full-text search is used
      )
      .sort(query ? { score: { $meta: 'textScore' } } : { title: 1 }) // Sort by textScore if search query, otherwise by title
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take)
      .exec();

    // Count total matching books
    const itemCount = await this.bookModel.countDocuments(searchFilter);

    // Construct pagination metadata
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(books, pageMetaDto);
  }
}
