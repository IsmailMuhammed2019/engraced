import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: MulterFile,
    folder: string,
    publicId?: string,
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `engracedsmile/${folder}`,
          public_id: publicId,
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async uploadMultipleImages(
    files: MulterFile[],
    folder: string,
  ): Promise<{ url: string; publicId: string }[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadImage(file, folder, `${folder}-${Date.now()}-${index}`),
    );

    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async deleteMultipleImages(publicIds: string[]): Promise<void> {
    const deletePromises = publicIds.map(publicId => this.deleteImage(publicId));
    await Promise.all(deletePromises);
  }

  generateImageUrl(publicId: string, transformations?: any): string {
    return cloudinary.url(publicId, {
      ...transformations,
      secure: true,
    });
  }
}
