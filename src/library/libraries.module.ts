import { Module } from '@nestjs/common';
import { LibraryTracksResolver } from './resolvers/library-tracks.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { LibraryModel, LibrarySchema } from './models/library.model';
import { LibraryTracksService } from './services/library-tracks.service';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  imports: [
    TracksModule,
    MongooseModule.forFeature([
      { name: LibraryModel.name, schema: LibrarySchema },
    ]),
  ],
  providers: [LibraryTracksService, LibraryTracksResolver],
})
export class LibrariesModule {}
