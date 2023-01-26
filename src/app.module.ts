import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { SystemModule } from './system/system.module';
import { TracksModule } from './tracks/tracks.module';
import { AuthModule } from './auth/auth.module';
import { RemoteModule } from './remote/remote.module';
import { PlaylistsModule } from './playlists/playlists.module';

@Module({
  imports: [
    CoreModule,
    SharedModule,
    AuthModule,
    SystemModule,
    TracksModule,
    RemoteModule,
    PlaylistsModule,
  ],
})
export class AppModule {}
