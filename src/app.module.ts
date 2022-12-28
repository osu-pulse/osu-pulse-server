import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { SystemModule } from './system/system.module';
import { TracksModule } from './tracks/tracks.module';

@Module({
  imports: [CoreModule, SharedModule, SystemModule, TracksModule],
})
export class AppModule {}
