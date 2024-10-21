import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { kebabCase } from 'lodash';
import { Media } from './schemas/media.schema'; // Import the Media schema
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MediaDocument } from './schemas/media.schema'; // Import the MediaDocument type
import sharp from 'sharp';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>,
  ) {}

  async create(imageFile: Express.Multer.File): Promise<Media> {
    const base64String = imageFile.buffer.toString('base64');
    const uniqueId = uuidv4();
    const fileType = imageFile.mimetype.split('/')[1];
    const filename = `${kebabCase(imageFile.originalname.split('.')[0])}-${uniqueId}.${fileType}`;

    const type = imageFile.mimetype;

    console.log('came here');

    const metadata = await sharp(imageFile.buffer).metadata();
    console.log('came here');
    const width = metadata.width || 300;
    const height = metadata.height || 300;

    const media = new this.mediaModel({
      filename,
      base64String,
      width,
      height,
      type,
    });
    return media.save();
  }

  async findByFilename(filename: string): Promise<Media> {
    return await this.mediaModel.findOne({ filename }).exec();
  }
}
