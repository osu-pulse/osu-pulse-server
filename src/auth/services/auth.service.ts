import { Injectable } from '@nestjs/common';
import { parseJwt } from '../helpers/jwt';
import { OsuAuthService } from '../../osu/services/osu-auth.service';

@Injectable()
export class AuthService {
  constructor(private osuAuthService: OsuAuthService) {}

  async validateToken(token: string): Promise<string | null> {
    const tokenValid = await this.osuAuthService.validateToken(token);
    if (!tokenValid) {
      return null;
    }

    const payload = parseJwt(token);
    return payload?.sub;
  }
}
