import { Injectable } from '@nestjs/common';
import { OsuAuthService } from '../../osu/services/osu-auth.service';
import jwtDecode, { JwtPayload } from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor(private osuAuthService: OsuAuthService) {}

  async validateToken(token: string): Promise<string | null> {
    const tokenValid = await this.osuAuthService.validateToken(token);
    if (!tokenValid) {
      return null;
    }

    const payload = jwtDecode<JwtPayload>(token);
    return payload.sub;
  }
}
