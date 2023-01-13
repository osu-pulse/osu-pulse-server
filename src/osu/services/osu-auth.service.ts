import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EnvironmentDto } from '../../core/dto/environment.dto';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosInstance } from 'axios';
import { AXIOS_OSU_OAUTH, AXIOS_OSU_API } from '../constants/injections';
import { TokenSet } from '../types/token-set';
import { BeatmapSetsWithCursor } from '../types/beatmap-sets-with-cursor';
import { BeatmapSet } from '../types/beatmap-set';
import { OsuException } from '../exceptions/osu.exception';

@Injectable()
export class OsuAuthService {
  constructor(
    private configService: ConfigService<EnvironmentDto, true>,
    @Inject(AXIOS_OSU_OAUTH)
    private axiosOsuOauth: AxiosInstance,
    @Inject(AXIOS_OSU_API)
    private axiosOsuApi: AxiosInstance,
  ) {}

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
}