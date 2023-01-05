import { Module } from '@nestjs/common';
import { OsuModule } from '../osu/osu.module';
import { TracksResolver } from './resolvers/tracks.resolver';
import { TracksService } from './services/tracks.service';
import { BucketModule } from '../bucket/bucket.module';

@Module({
  imports: [OsuModule, BucketModule],
  providers: [TracksService, TracksResolver],
  exports: [TracksService],
})
export class TracksModule {}
