import { Module } from '@nestjs/common';
import { OsuService } from './services/osu.service';
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
    OsuService,
    KitsuService,
  ],
  exports: [OsuService, OsuAuthService, KitsuService],
})
export class OsuModule {}
