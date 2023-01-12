import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EnvironmentDto } from '../../core/dto/environment.dto';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosInstance } from 'axios';
import { AXIOS_OSU_OAUTH, AXIOS_OSU_API } from '../constants/injections';
import { TokenSet } from '../types/token-set';
import { BeatmapSetsWithCursor } from '../types/beatmap-sets-with-cursor';
import { BeatmapSet } from '../types/beatmap-set';
import { OsuException } from '../exceptions/osu.exception';
// TODO: Разделить на два сервиса
@Injectable()
export class OsuService implements OnModuleInit {
  private readonly offset = 10;
  private readonly logger = new Logger(OsuService.name);
  private token: string;

  constructor(
    private configService: ConfigService<EnvironmentDto, true>,
    @Inject(AXIOS_OSU_OAUTH)
    private axiosOsuOauth: AxiosInstance,
    @Inject(AXIOS_OSU_API)
    private axiosOsuApi: AxiosInstance,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.login();
  }

  private async login(): Promise<void> {
    try {
      const response = await this.getTokenByClientCredentials(
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

  async validateToken(token: string): Promise<boolean> {
    try {
      await this.axiosOsuApi.head('me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch (e) {
      const {
        message,
        response: { status },
      } = e as AxiosError;
      if (status == 401) {
        return false;
      } else {
        throw new OsuException(message);
      }
    }
  }

  async getTokenByClientCredentials(
    clientId: string,
    clientSecret: string,
  ): Promise<TokenSet> {
    try {
      const { data } = await this.axiosOsuOauth.post<TokenSet>('token', {
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'public',
      });
      return data;
    } catch (e) {
      const { message } = e as AxiosError;
      throw new OsuException(message);
    }
  }

  async getTokenByRefreshToken(
    clientId: string,
    clientSecret: string,
    refreshToken: string,
  ): Promise<TokenSet> {
    try {
      const { data } = await this.axiosOsuOauth.post<TokenSet>('token', {
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        scope: 'identify',
      });
      return data;
    } catch (e) {
      const { message } = e as AxiosError;
      throw new OsuException(message);
    }
  }

  async getBeatmapSets(
    search?: string,
    cursor?: string,
  ): Promise<BeatmapSetsWithCursor> {
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

  async getBeatmapSetById(beatmapSetId: string): Promise<BeatmapSet> {
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
