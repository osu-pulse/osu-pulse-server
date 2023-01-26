import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaylistModel, PlaylistSchema } from './models/playlist.model';
import { PlaylistsService } from './services/playlists.service';
import { PlaylistsResolver } from './resolvers/playlists.resolver';
import { MyPlaylistsResolver } from './resolvers/my-playlists.resolver';
// TODO: Add endpoint to download cover
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: PlaylistModel.name, schema: PlaylistSchema },
    ]),
  ],
  providers: [PlaylistsService, PlaylistsResolver, MyPlaylistsResolver],
  exports: [PlaylistsService],
})
export class PlaylistsModule {}
