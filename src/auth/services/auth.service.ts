import { Injectable } from '@nestjs/common';
import { parseJwt } from '../helpers/jwt';
import { OsuAuthService } from '../../osu/services/osu-auth.service';
import { LibrariesService } from '../../tracks/services/libraries.service';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private osuAuthService: OsuAuthService,
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
