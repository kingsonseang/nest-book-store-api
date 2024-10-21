import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  StreamableFile,
  Res,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { ApiTags } from '@nestjs/swagger';
import sharp from 'sharp';
import { Readable } from 'stream';
import { Response } from 'express';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':filename')
  async render(
    @Param('filename') filename: string,
    @Query('width') width: number,
    @Query('height') height: number,
    @Query('quality') quality: number = 70,
    @Res() response: Response,
  ): Promise<StreamableFile> {
    const media = await this.mediaService.findByFilename(filename);
    if (!media) {
      throw new NotFoundException('Image not found');
    }

    const defaultWidth = media.width || 300;
    const defaultHeight = media.height || 300;

    const finalWidth =
      typeof width === 'number' && width > 0 ? width : defaultWidth;
    const finalHeight =
      typeof height === 'number' && height > 0 ? height : defaultHeight;

    try {
      const imageStream = sharp(Buffer.from(media.base64String, 'base64'))
        .resize(finalWidth, finalHeight, { fit: 'inside' })
        .png({ quality: Math.min(Math.max(quality, 0), 100) });

      response.set({
        'Content-Type': 'image/png', // Change this to 'image/jpeg' if your images are in JPEG format
        'Content-Disposition': 'inline', // Display inline in the browser
      });

      imageStream.pipe(response);
      return;
      // return new StreamableFile(imageStream);
    } catch (error) {
      throw new Error('Error processing image: ' + error.message);
    }
  }
}
