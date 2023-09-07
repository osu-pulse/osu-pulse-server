import { Inject, Injectable, Logger } from '@nestjs/common';
import { AxiosError, AxiosInstance } from 'axios';
import { AXIOS_OSU_API, AXIOS_OSU_OAUTH } from '../constants/injections';
import { OsuException } from '../exceptions/osu.exception';
import { OsuTokenSet } from '../types/osu-token-set';
import { OsuToken } from '../types/osu-token';

@Injectable()
export class OsuOAuthService {
  private readonly logger = new Logger(OsuOAuthService.name);
  constructor(
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
  ): Promise<OsuToken> {
    try {
      const { data } = await this.axiosOsuOauth.post<OsuToken>('token', {
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
