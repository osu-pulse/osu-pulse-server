import { Strategy } from 'passport-http-bearer';
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class OauthStrategy
  extends PassportStrategy(Strategy, 'oauth')
  implements AbstractStrategy
{
  constructor(private authService: AuthService) {
    super();
  }

  async validate(token: string): Promise<string> {
    return await this.authService.validateToken(token);
  }
}
