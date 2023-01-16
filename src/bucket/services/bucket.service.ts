import { Injectable, OnModuleInit } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import Minio from 'minio';
import { ConfigService } from '@nestjs/config';
import { FileType } from '../constants/file-type';
import { BucketName } from '../constants/bucket-name';
import { Env } from '../../core/types/env';

@Injectable()
export class BucketService implements OnModuleInit {
  constructor(
    private configService: ConfigService<Env, true>,
    private minioService: MinioService,
  ) {}

  async onModuleInit() {
    await Promise.all(
      Object.values(BucketName).map(async (bucket) => {
        const bucketExists = await this.client.bucketExists(bucket);
        if (!bucketExists) {
          await this.client.makeBucket(bucket, 'eu-central-1');
          await this.client.setBucketPolicy(bucket, this.getPolicy(bucket));
        }
      }),
    );
  }

  private getPolicy(bucket: string): string {
    return JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicRead',
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject', 's3:GetObjectVersion'],
          Resource: [`arn:aws:s3:::${bucket}/*`],
        },
      ],
    });
  }

  private get client(): Minio.Client {
    return this.minioService.client;
  }

  async exists(bucket: BucketName, object: string): Promise<boolean> {
    try {
      await this.client.statObject(bucket, object);
      return true;
    } catch {
      return false;
    }
  }

  async create(
    bucket: BucketName,
    object: string,
    file: Buffer,
    type: FileType,
  ): Promise<void> {
    await this.client.putObject(bucket, object, file, { 'Content-Type': type });
  }

  async remove(bucket: BucketName, object: string): Promise<void> {
    await this.client.removeObject(bucket, object);
  }
}
