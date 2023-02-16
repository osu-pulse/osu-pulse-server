import Strategy from 'passport-osu';
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenSetModel } from '../models/token-set.model';
import { EnvModel } from '../../core/models/env.model';

@Injectable()
export class OsuStrategy
  extends PassportStrategy(Strategy, 'osu')
  implements AbstractStrategy
{
  constructor(private configService: ConfigService<EnvModel, true>) {
    super({
      callbackURL: `${configService.get('URL_AUTH')}/callback`,
      clientID: configService.get('OSU_CLIENT_ID'),
      clientSecret: configService.get('OSU_CLIENT_SECRET'),
    });
  }

  validate(accessToken: string, refreshToken: string): TokenSetModel {
    return {
      accessToken,
      refreshToken,
    };
  }
}
