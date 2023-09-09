import { Module } from '@nestjs/common';
import { OsuBeatmapsService } from './services/osu-beatmaps.service';
import { ConfigModule } from '@nestjs/config';
import {
  AXIOS_OSU_API,
  AXIOS_OSU_DIRECT,
  AXIOS_OSU_OAUTH,
} from './constants/injections';
import { OsuOauthService } from './services/osu-oauth.service';
import { AuthModule } from '../auth/auth.module';
import { OsuUsersService } from './services/osu-users.service';
import { axiosOsuApi, axiosOsuDirect, axiosOsuOauth } from './helpers/axios';
import { OsuAuthService } from './services/osu-auth.service';
import { OsuDirectBeatmapsService } from './services/osu-direct-beatmaps.service';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [
    { provide: AXIOS_OSU_OAUTH, useValue: axiosOsuOauth },
    { provide: AXIOS_OSU_API, useValue: axiosOsuApi },
    { provide: AXIOS_OSU_DIRECT, useValue: axiosOsuDirect },
    OsuAuthService,
    OsuOauthService,
    OsuBeatmapsService,
    OsuDirectBeatmapsService,
    OsuUsersService,
  ],
  exports: [
    OsuBeatmapsService,
    OsuDirectBeatmapsService,
    OsuUsersService,
    OsuOauthService,
  ],
})
export class OsuModule {}
