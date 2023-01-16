import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosInstance } from 'axios';
import { AXIOS_OSU_API, AXIOS_OSU_OAUTH } from '../constants/injections';
import { OsuTokenSet } from '../types/osu-token-set';
import { OsuException } from '../exceptions/osu.exception';
import { Env } from '../../core/types/env';

@Injectable()
export class OsuAuthService {
  constructor(
    private configService: ConfigService<Env, true>,
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
  ): Promise<OsuTokenSet> {
    try {
      const { data } = await this.axiosOsuOauth.post<OsuTokenSet>('token', {
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
  ): Promise<OsuTokenSet | null> {
    try {
      const { data } = await this.axiosOsuOauth.post<OsuTokenSet>('token', {
        grant_type: 'refresh_token',
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        scope: 'identify',
      });
      return data;
    } catch (e) {
      const {
        message,
        response: { status },
      } = e as AxiosError;
      if (status == 401) {
        return null;
      } else {
        throw new OsuException(message);
      }
    }
  }
}
