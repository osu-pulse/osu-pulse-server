import { Module } from '@nestjs/common';
import { OsuModule } from '../osu/osu.module';
import { TracksResolver } from './resolvers/tracks.resolver';
import { TracksService } from './services/tracks.service';
import { BucketModule } from '../bucket/bucket.module';
import { TracksSubService } from './services/tracks-sub.service';

@Module({
  imports: [OsuModule, BucketModule],
  providers: [TracksService, TracksSubService, TracksResolver],
  exports: [TracksService, TracksSubService],
})
export class TracksModule {}
