import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { OsuOauthService } from './osu-oauth.service';
import { Env } from '../../core/helpers/env';
import { seconds } from 'milliseconds';

@Injectable()
export class OsuAuthService implements OnModuleInit {
  private readonly logger = new Logger(OsuAuthService.name);
  private accessToken = new ReplaySubject<string>();

  constructor(
    private configService: ConfigService<Env, true>,
    private osuOAuthService: OsuOauthService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.login();
  }

  private async login(): Promise<void> {
    try {
      const response = await this.osuOAuthService.getTokenByClientCredentials(
        this.configService.get('OSU_CLIENT_ID'),
        this.configService.get('OSU_CLIENT_SECRET'),
      );

      this.logger.verbose(
        `Login succeed. Access token: ${response.access_token}`,
      );

      this.accessToken.next(response.access_token);

      setTimeout(() => this.login(), (response.expires_in - 10) * seconds(1));
    } catch (e) {
      this.logger.error(e);
      setTimeout(() => this.login(), 10 * seconds(1));
    }
  }

  async getToken(): Promise<string> {
    return firstValueFrom(this.accessToken);
  }
}
