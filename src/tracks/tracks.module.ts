import { Module } from '@nestjs/common';
import { OsuModule } from '../osu/osu.module';
import { TracksResolver } from './resolvers/tracks.resolver';
import { TracksService } from './services/tracks.service';
import { BucketModule } from '../bucket/bucket.module';
import { TrackCachesService } from './services/track-caches.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackCacheModel, TrackCacheSchema } from './models/track-cache.model';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    OsuModule,
    BucketModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: TrackCacheModel.name, schema: TrackCacheSchema },
    ]),
  ],
  providers: [TracksService, TrackCachesService, TracksResolver],
  exports: [TracksService],
})
export class TracksModule {}
