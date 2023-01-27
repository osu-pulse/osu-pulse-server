import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaylistModel, PlaylistSchema } from './models/playlist.model';
import { PlaylistsService } from './services/playlists.service';
import { PlaylistsResolver } from './resolvers/playlists.resolver';
import { MyPlaylistsResolver } from './resolvers/my-playlists.resolver';
import { PlaylistTracksResolver } from './resolvers/playlist-tracks.resolver';
import { PlaylistTracksService } from './services/playlist-tracks.service';
import { PlaylistsController } from './controllers/playlists.controller';
import { BucketModule } from '../bucket/bucket.module';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  imports: [
    ConfigModule,
    BucketModule,
    TracksModule,
    MongooseModule.forFeature([
      { name: PlaylistModel.name, schema: PlaylistSchema },
    ]),
  ],
  providers: [
    PlaylistsService,
    PlaylistTracksService,
    PlaylistsResolver,
    MyPlaylistsResolver,
    PlaylistTracksResolver,
  ],
  controllers: [PlaylistsController],
  exports: [PlaylistsService, PlaylistTracksService],
})
export class PlaylistsModule {}
