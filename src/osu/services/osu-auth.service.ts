import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvModel } from '../../core/models/env.model';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { OsuOAuthService } from './osu-oauth.service';

@Injectable()
export class OsuAuthService implements OnModuleInit {
  private readonly logger = new Logger(OsuAuthService.name);
  private accessToken = new ReplaySubject<string>();

  constructor(
    private configService: ConfigService<EnvModel, true>,
    private osuOAuthService: OsuOAuthService,
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

      setTimeout(() => this.login(), (response.expires_in - 10) * 1000);
    } catch (e) {
      this.logger.error(e);
      setTimeout(() => this.login(), 10 * 1000);
    }
  }

  async getToken(): Promise<string> {
    return firstValueFrom(this.accessToken);
  }
}
