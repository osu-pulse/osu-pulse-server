import { Strategy } from 'passport-http-bearer';
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';

@Injectable()
export class OauthStrategy
  extends PassportStrategy(Strategy, 'oauth')
  implements AbstractStrategy
{
  constructor(private authService: AuthService) {
    super();
  }

  async validate(token: string): Promise<string> {
    const userId = await this.authService.validateToken(token);

    if (!userId) {
      throw new UnauthorizedException();
    }

    return userId;
  }
}
