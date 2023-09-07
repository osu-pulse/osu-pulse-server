import { Module } from '@nestjs/common';
import { OsuBeatmapsService } from './services/osu-beatmaps.service';
import { ConfigModule } from '@nestjs/config';
import {
  AXIOS_OSU_API,
  AXIOS_OSU_DIRECT,
  AXIOS_OSU_OAUTH,
} from './constants/injections';
import { OsuOAuthService } from './services/osu-oauth.service';
import { AuthModule } from '../auth/auth.module';
import { OsuUsersService } from './services/osu-users.service';
import { axiosOsuApi, axiosOsuDirect, axiosOsuOauth } from './helpers/axios';
import { OsuAuthService } from './services/osu-auth.service';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [
    { provide: AXIOS_OSU_OAUTH, useValue: axiosOsuOauth },
    { provide: AXIOS_OSU_API, useValue: axiosOsuApi },
    { provide: AXIOS_OSU_DIRECT, useValue: axiosOsuDirect },
    OsuAuthService,
    OsuOAuthService,
    OsuBeatmapsService,
    OsuUsersService,
  ],
  exports: [OsuBeatmapsService, OsuUsersService, OsuOAuthService],
})
export class OsuModule {}
