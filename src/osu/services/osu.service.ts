import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EnvironmentDto } from '../../core/dto/environment.dto';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosInstance } from 'axios';
import { AXIOS_OSU_OAUTH, AXIOS_OSU_API } from '../constants/injections';
import { OsuTokenSet } from '../types/osu-token-set';
import { OsuBeatmapSetsWithCursor } from '../types/osu-beatmap-sets-with-cursor';
import { OsuBeatmapSet } from '../types/osu-beatmap-set';
import { OsuException } from '../exceptions/osu.exception';
import { OsuAuthService } from './osu-auth.service';
// TODO: Разделить на два сервиса
@Injectable()
export class OsuService implements OnModuleInit {
  private readonly logger = new Logger(OsuService.name);
  private readonly offset = 10;
  private token: string;

  constructor(
    private configService: ConfigService<EnvironmentDto, true>,
    private osuAuthService: OsuAuthService,
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

  async getBeatmapSets(
    search?: string,
    cursor?: string,
  ): Promise<OsuBeatmapSetsWithCursor> {
    try {
      const { data } = await this.axiosOsuApi.get('beatmapsets/search', {
        headers: { Authorization: `Bearer ${this.token}` },
        params: { q: search, cursor_string: cursor },
      });
      return data;
    } catch (e) {
      const { message } = e as AxiosError;
      throw new OsuException(message);
    }
  }

  async getBeatmapSetById(beatmapSetId: string): Promise<OsuBeatmapSet> {
    try {
      const { data } = await this.axiosOsuApi.get(
        `beatmapsets/${beatmapSetId}`,
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
}
