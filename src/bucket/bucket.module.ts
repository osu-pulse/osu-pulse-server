import { Module } from '@nestjs/common';
import { BucketService } from './services/bucket.service';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env } from '../core/helpers/env';

@Module({
  imports: [
    ConfigModule,
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => ({
        port: Number(configService.get('MINIO_PORT')),
        endPoint: configService.get('MINIO_HOST'),
        accessKey: configService.get('MINIO_USERNAME'),
        secretKey: configService.get('MINIO_PASSWORD'),
        useSSL: false,
      }),
    }),
  ],
  providers: [BucketService],
  exports: [MinioModule, BucketService],
})
export class BucketModule {}
