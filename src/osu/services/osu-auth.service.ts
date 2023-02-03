import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosInstance } from 'axios';
import { AXIOS_OSU_API, AXIOS_OSU_OAUTH } from '../constants/injections';
import { OsuTokenSet } from '../types/osu-token-set';
import { OsuException } from '../exceptions/osu.exception';
import { Env } from '../../core/types/env';

@Injectable()
export class OsuAuthService implements OnModuleInit {
  private readonly logger = new Logger(OsuAuthService.name);
  private readonly offset = 10;
  private token: string;

  constructor(
    private configService: ConfigService<Env, true>,
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

  getToken(): string {
    return this.token;
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
