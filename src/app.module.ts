import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { SystemModule } from './system/system.module';
import { TracksModule } from './tracks/tracks.module';
import { AuthModule } from './auth/auth.module';
import { RemoteModule } from './remote/remote.module';
import { LibrariesModule } from './library/libraries.module';

@Module({
  imports: [
    CoreModule,
    SharedModule,
    AuthModule,
    SystemModule,
    TracksModule,
    RemoteModule,
    LibrariesModule,
  ],
})
export class AppModule {}
