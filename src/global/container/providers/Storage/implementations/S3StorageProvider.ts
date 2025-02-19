import fs from 'fs';
import path from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/storage';

import IStorageProvider from '../models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: process.env.AWS_DEFAULT_REGION,
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME
          ? process.env.AWS_S3_BUCKET_NAME
          : 'put-S3-bucket-name',
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return `${process.env.AWS_S3_BASE_URL}/${file}`;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME
          ? process.env.AWS_S3_BUCKET_NAME
          : 'put-S3-bucket-name',
        Key: file,
      })
      .promise();
  }
}

export default S3StorageProvider;
