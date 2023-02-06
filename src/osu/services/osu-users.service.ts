import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosInstance } from 'axios';
import { AXIOS_OSU_API } from '../constants/injections';
import { OsuBeatmapSet } from '../types/osu-beatmap-set';
import { OsuException } from '../exceptions/osu.exception';
import { OsuAuthService } from './osu-auth.service';
import { OsuBeatmap } from '../types/osu-beatmap';
import { OsuBeatmapSetsWithCursor } from '../types/osu-beatmap-sets-with-cursor';
import { AccessTokenHolderService } from '../../auth/services/access-token-holder.service';
import { Env } from '../../core/types/env';
import { splitChunks } from '../../shared/helpers/array';
import { OsuUser } from '../types/osu-user';
import { use } from 'passport';

@Injectable()
export class OsuUsersService {
  constructor(
    private osuAuthService: OsuAuthService,
    private accessTokenHolderService: AccessTokenHolderService,
    @Inject(AXIOS_OSU_API)
    private axiosOsuApi: AxiosInstance,
  ) {}

  async getMe(userId: string): Promise<OsuUser> {
    try {
      const token = this.accessTokenHolderService.get(userId);
      const { data } = await this.axiosOsuApi.get<OsuUser>('me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (e) {
      const { message } = e as AxiosError;
      throw new OsuException(message);
    }
  }
}
