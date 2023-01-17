import { Module } from '@nestjs/common';
import { OsuModule } from '../osu/osu.module';
import { TracksResolver } from './resolvers/tracks.resolver';
import { TracksService } from './services/tracks.service';
import { BucketModule } from '../bucket/bucket.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [OsuModule, BucketModule, ConfigModule],
  providers: [TracksService, TracksResolver],
  exports: [TracksService],
})
export class TracksModule {}
