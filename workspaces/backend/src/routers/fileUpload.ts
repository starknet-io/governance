
import AWS, { S3 } from 'aws-sdk';
import { router, protectedProcedure } from '../utils/trpc';
import { z } from 'zod';
import sanitize from "sanitize-filename";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB


const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint('https://sfo3.digitaloceanspaces.com'),
  credentials: {
    accessKeyId: process.env.DIGITAL_OCEAN_ACCESS_KEY!,
    secretAccessKey: process.env.DIGITAL_SECRET_OCEAN_ACCESS_KEY!,
  }
});

// We can add more if needed
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
];

export const fileUploadRouter = router({

  uploadFile: protectedProcedure
    .input(z.any())
    .mutation(async (opts) => {
      const file = opts.ctx.file;

      if (!file) {
        throw new Error('File not provided');
      }

      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        throw new Error('Invalid file type');
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds maximum limit of 1MB');
      }

      const filename = sanitize(file.originalname);
      const filePath = `${Date.now()}-${filename}`;

      const params = {
        Body: file.buffer,
        Bucket: 'governance',
        Key: filePath,
        ACL: 'public-read',
        ContentType: file.mimetype,
      };

      return new Promise<S3.ManagedUpload.SendData>((resolve, reject) => {
        s3.upload(params, (err: Error, data: S3.ManagedUpload.SendData) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }),
});
