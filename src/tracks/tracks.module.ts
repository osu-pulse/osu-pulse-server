import { Module } from '@nestjs/common';
import { OsuModule } from '../osu/osu.module';
import { TracksResolver } from './resolvers/tracks.resolver';
import { TracksService } from './services/tracks.service';

@Module({
  imports: [OsuModule],
  providers: [TracksService, TracksResolver],
  exports: [TracksService],
})
export class TracksModule {}
