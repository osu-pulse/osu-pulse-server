import { Injectable } from '@nestjs/common';
import { parseJwt } from '../helpers/jwt';
import { OsuOauthService } from '../../osu/services/osu-oauth.service';
import { LibrariesService } from '../../tracks/services/libraries.service';
import DeviceDetector from 'device-detector-js';

@Injectable()
export class AuthService {
  private readonly detector = new DeviceDetector({ skipBotDetection: true });

  constructor(
    private osuAuthService: OsuOauthService,
    private librariesService: LibrariesService,
  ) {}

  async validateToken(accessToken: string): Promise<string | null> {
    const tokenValid = await this.osuAuthService.validateToken(accessToken);
    if (!tokenValid) {
      return null;
    }

    const payload = parseJwt(accessToken);
    return payload?.sub;
  }

  async registerUser(userId: string): Promise<void> {
    const libraryExists = await this.librariesService.existsByUserId(userId);
    if (!libraryExists) {
      await this.librariesService.create({ userId });
    }
  }
}
