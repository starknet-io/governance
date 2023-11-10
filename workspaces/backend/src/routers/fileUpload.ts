import AWS, { S3 } from 'aws-sdk';
import { router, protectedProcedure } from '../utils/trpc';
import { z } from 'zod';

const s3 = new AWS.S3({
  endpoint: new AWS.Endpoint('https://sfo3.digitaloceanspaces.com'),
  credentials: {
    accessKeyId: process.env.DIGITAL_OCEAN_ACCESS_KEY!,
    secretAccessKey: process.env.DIGITAL_SECRET_OCEAN_ACCESS_KEY!,
  },
});

export const fileUploadRouter = router({
  uploadFile: protectedProcedure.input(z.any()).mutation(async (opts) => {
    const params = {
      Body: opts.ctx.file?.buffer,
      Bucket: 'governance',
      Key: `${Date.now()}-${opts.ctx?.file?.originalname}`,
      ACL: 'public-read',
      ContentType: opts.ctx?.file?.mimetype,
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
