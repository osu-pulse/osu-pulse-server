import { Module } from '@nestjs/common';
import { OsuModule } from '../osu/osu.module';
import { TracksResolver } from './resolvers/tracks.resolver';
import { TracksService } from './services/tracks.service';
import { BucketModule } from '../bucket/bucket.module';
import { ConfigModule } from '@nestjs/config';
import { UserTrackMappingsService } from './services/user-track-mappings.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserTrackMappingModel,
  UserTrackMappingSchema,
} from './models/user-track-mapping.model';
import { MyTracksResolver } from './resolvers/my-tracks.resolver';

@Module({
  imports: [
    OsuModule,
    BucketModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: UserTrackMappingModel.name, schema: UserTrackMappingSchema },
    ]),
  ],
  providers: [
    TracksService,
    UserTrackMappingsService,
    TracksResolver,
    MyTracksResolver,
  ],
  exports: [TracksService],
})
export class TracksModule {}
