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

@Injectable()
export class OsuService implements OnModuleInit {
  private readonly logger = new Logger(OsuService.name);
  private readonly offset = 10;
  private token: string;

  constructor(
    private configService: ConfigService<Env, true>,
    private osuAuthService: OsuAuthService,
    private accessTokenHolderService: AccessTokenHolderService,
    @Inject(AXIOS_OSU_API)
    private axiosOsuApi: AxiosInstance,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.login();
  }

  private async login(): Promise<void> {
    try {
      const response = await this.osuAuthService.getTokenByClientCredentials(
        this.configService.get('OSU_CLIENT_ID'),
        this.configService.get('OSU_CLIENT_SECRET'),
      );

      this.logger.verbose(`Access token received: ${response.access_token}`);

      this.token = response.access_token;
      setTimeout(
        () => this.login(),
        (response.expires_in - this.offset) * 1000,
      );
    } catch (e) {
      this.logger.error(e);
      setTimeout(() => this.login(), this.offset * 1000);
    }
  }

  async existsBeatmapById(beatmapId): Promise<boolean> {
    try {
      await this.axiosOsuApi(`beatmaps/${beatmapId}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return true;
    } catch (e) {
      const {
        message,
        response: { status },
      } = e as AxiosError;
      if (status == 404) {
        return false;
      } else {
        throw new OsuException(message);
      }
    }
  }

  async getAllBeatmapSets(
    search?: string,
    cursor?: string,
  ): Promise<OsuBeatmapSetsWithCursor> {
    try {
      const { data } = await this.axiosOsuApi.get<{
        beatmapsets: OsuBeatmapSet[];
        cursor_string?: string;
      }>('beatmapsets/search', {
        headers: { Authorization: `Bearer ${this.token}` },
        params: { q: search, cursor_string: cursor },
      });
      return {
        data: data.beatmapsets,
        cursor: data.cursor_string,
      };
    } catch (e) {
      const { message } = e as AxiosError;
      throw new OsuException(message);
    }
  }

  async getBeatmapById(beatmapId: string): Promise<OsuBeatmap> {
    try {
      const { data } = await this.axiosOsuApi.get<OsuBeatmap>(
        `beatmaps/${beatmapId}`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        },
      );
      return data;
    } catch (e) {
      const { message } = e as AxiosError;
      throw new OsuException(message);
    }
  }

  async getBeatmapsByIds(beatmapIds: string[]): Promise<OsuBeatmap[]> {
    try {
      const chunks = await Promise.all(
        splitChunks(beatmapIds, 50).map((ids) =>
          this.axiosOsuApi.get<{
            beatmaps: OsuBeatmap[];
          }>(`beatmaps`, {
            headers: { Authorization: `Bearer ${this.token}` },
            params: Object.fromEntries(
              ids.map((id, i) => [`ids[${i}]`, Number(id)]),
            ),
          }),
        ),
      );
      const beatmaps = chunks.flatMap(({ data: { beatmaps } }) => beatmaps);

      return beatmapIds
        .map(Number)
        .map((beatmapId) => beatmaps.find(({ id }) => id === beatmapId));
    } catch (e) {
      const { message } = e as AxiosError;
      throw new OsuException(message);
    }
  }
}
