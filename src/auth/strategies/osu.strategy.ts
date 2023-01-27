import Strategy from 'passport-osu';
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenSet } from '../types/token-set';
import { Env } from '../../core/types/env';

@Injectable()
export class OsuStrategy
  extends PassportStrategy(Strategy, 'osu')
  implements AbstractStrategy
{
  constructor(private configService: ConfigService<Env, true>) {
    super({
      callbackURL: `${configService.get('URL_OAUTH')}/callback`,
      clientID: configService.get('OSU_CLIENT_ID'),
      clientSecret: configService.get('OSU_CLIENT_SECRET'),
    });
  }

  validate(accessToken: string, refreshToken: string): TokenSet {
    return {
      accessToken,
      refreshToken,
    };
  }
}
