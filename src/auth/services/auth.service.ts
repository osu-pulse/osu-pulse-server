import { Injectable } from '@nestjs/common';
import { OsuService } from '../../osu/services/osu.service';
import { parseJwt } from '../helpers/jwt';

@Injectable()
export class AuthService {
  constructor(private osuService: OsuService) {}

  async validateToken(token: string): Promise<string | null> {
    const tokenValid = await this.osuService.validateToken(token);
    if (!tokenValid) {
      return null;
    }

    const payload = parseJwt(token);
    return payload?.sub;
  }
}
