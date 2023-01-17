import { Module } from '@nestjs/common';
import { OsuModule } from '../osu/osu.module';
import { TracksResolver } from './resolvers/tracks.resolver';
import { TracksService } from './services/tracks.service';
import { BucketModule } from '../bucket/bucket.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MyTracksResolver } from './resolvers/my-tracks.resolver';
import { LibraryModel, LibrarySchema } from './models/library.model';
import { LibrariesService } from './services/libraries.service';
import { LibraryTracksService } from './services/library-tracks.service';

@Module({
  imports: [
    OsuModule,
    BucketModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: LibraryModel.name, schema: LibrarySchema },
    ]),
  ],
  providers: [
    TracksService,
    LibrariesService,
    LibraryTracksService,
    TracksResolver,
    MyTracksResolver,
  ],
  exports: [TracksService, LibrariesService],
})
export class TracksModule {}
