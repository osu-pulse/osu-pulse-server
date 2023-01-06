import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EnvironmentDto } from '../../core/dto/environment.dto';
import { ConfigService } from '@nestjs/config';
import { AxiosInstance } from 'axios';
import { AXIOS_OSU, AXIOS_OSU_API } from '../constants/injections';
import { Token } from '../types/token';
import { BeatmapSetsWithCursor } from '../types/beatmap-sets-with-cursor';
import { BeatmapSet } from '../types/beatmap-set';

@Injectable()
export class OsuService implements OnModuleInit {
  private readonly offset = 10;
  private readonly logger = new Logger(OsuService.name);
  private token: string;

  constructor(
    private configService: ConfigService<EnvironmentDto, true>,
    @Inject(AXIOS_OSU)
    private axiosOsu: AxiosInstance,
    @Inject(AXIOS_OSU_API)
    private axiosOsuApi: AxiosInstance,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.login();
  }

  private async login(): Promise<void> {
    try {
      const response = await this.getToken(
        this.configService.get('OSU_CLIENT_ID'),
        this.configService.get('OSU_CLIENT_SECRET'),
      );

      this.logger.log(
        `Access token received: ${response.access_token}, will expire after ${response.expires_in} seconds`,
      );

      this.token = response.access_token;
      setTimeout(() => this.login(), response.expires_in - this.offset);
    } catch (e) {
      this.logger.error(e);
      setTimeout(() => this.login(), this.offset);
    }
  }

  private async getToken(
    clientId: string,
    clientSecret: string,
  ): Promise<Token> {
    const { data } = await this.axiosOsu.post<Token>(`oauth/token`, {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'public',
    });
    return data;
  }

  async beatmapSetExists(beatmapSetId: string): Promise<boolean> {
    try {
      await this.axiosOsuApi.get(`beatmapsets/${beatmapSetId}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async getBeatmapSets(
    search?: string,
    cursor?: string,
  ): Promise<BeatmapSetsWithCursor> {
    const { data } = await this.axiosOsuApi.get(`beatmapsets/search`, {
      headers: { Authorization: `Bearer ${this.token}` },
      params: { q: search, cursor_string: cursor },
    });
    return data;
  }

  async getBeatmapSetById(beatmapSetId: string): Promise<BeatmapSet> {
    const { data } = await this.axiosOsuApi.get(`beatmapsets/${beatmapSetId}`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    return data;
  }
}
