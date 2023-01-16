import { Module } from '@nestjs/common';
import { BucketService } from './services/bucket.service';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env } from '../core/types/env';

@Module({
  imports: [
    ConfigModule,
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => ({
        port: Number(configService.get('MI_PORT')),
        endPoint: configService.get('MI_ENDPOINT'),
        accessKey: configService.get('MI_USERNAME'),
        secretKey: configService.get('MI_PASSWORD'),
        useSSL: false,
      }),
    }),
  ],
  providers: [BucketService],
  exports: [MinioModule, BucketService],
})
export class BucketModule {}
