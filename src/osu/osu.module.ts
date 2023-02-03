import { Module } from '@nestjs/common';
import { OsuBeatmapsService } from './services/osu-beatmaps.service';
import { ConfigModule } from '@nestjs/config';
import axios from 'axios';
import {
  AXIOS_KITSU,
  AXIOS_OSU_OAUTH,
  AXIOS_OSU_API,
} from './constants/injections';
import { kitsuApiUrl, osuApiUrl, osuOauthUrl } from './constants/api-url';
import { KitsuService } from './services/kitsu.service';
import { OsuAuthService } from './services/osu-auth.service';
import { AuthModule } from '../auth/auth.module';
import { OsuUsersService } from './services/osu-users.service';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [
    {
      provide: AXIOS_OSU_OAUTH,
      useValue: axios.create({ baseURL: osuOauthUrl }),
    },
    {
      provide: AXIOS_OSU_API,
      useValue: axios.create({ baseURL: osuApiUrl }),
    },
    {
      provide: AXIOS_KITSU,
      useValue: axios.create({ baseURL: kitsuApiUrl }),
    },
    OsuAuthService,
    OsuBeatmapsService,
    OsuUsersService,
    KitsuService,
  ],
  exports: [OsuBeatmapsService, OsuUsersService, OsuAuthService, KitsuService],
})
export class OsuModule {}
