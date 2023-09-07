import { Injectable } from '@nestjs/common';
import { parseJwt } from '../helpers/jwt';
import { OsuOAuthService } from '../../osu/services/osu-oauth.service';
import { LibrariesService } from '../../tracks/services/libraries.service';

@Injectable()
export class AuthService {
  constructor(
    private osuAuthService: OsuOAuthService,
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
