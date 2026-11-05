import { v2 as cloudinary } from 'cloudinary';
import { AppError } from '../utils/appError.js';

const imageSignatures: Record<string, (buffer: Buffer) => boolean> = {
  'image/jpeg': (buffer) => buffer.length >= 3 &&
    buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,
  'image/png': (buffer) => buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  'image/webp': (buffer) => buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP',
  'image/gif': (buffer) => {
    const signature = buffer.toString('ascii', 0, 6);
    return signature === 'GIF87a' || signature === 'GIF89a';
  }
};

function configureCloudinary(): void {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new AppError('Cloudinary is not configured on the server.', 503);
  }

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
}

export async function uploadImage(file: Express.Multer.File) {
  const isValidImage = imageSignatures[file.mimetype]?.(file.buffer) ?? false;
  if (!isValidImage) {
    throw new AppError('Upload a valid JPEG, PNG, GIF, or WebP image.', 400);
  }

  configureCloudinary();

  return new Promise<{
    url: string;
    publicId: string;
    format: string;
    bytes: number;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'rcbpro',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error('Cloudinary returned no upload result.'));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes
        });
      }
    );

    stream.end(file.buffer);
  });
}
