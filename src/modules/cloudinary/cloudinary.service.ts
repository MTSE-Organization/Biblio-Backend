import { CloudinaryResponse } from '@/modules/cloudinary/dtos/response.type';
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const options = file['cloudinaryOptions'] || {
        folder: 'bsw-uploads',
        format: 'webp',
        resource_type: 'image'
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) return reject(new Error(String(error.message)));
          if (!result)
            return reject(new Error('Cloudinary upload failed: no result'));
          resolve(result);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
