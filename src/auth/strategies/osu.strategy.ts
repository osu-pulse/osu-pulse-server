import { Strategy } from 'passport-oauth2';
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentDto } from '../../core/dto/environment.dto';

@Injectable()
export class OsuStrategy
  extends PassportStrategy(Strategy, 'osu')
  implements AbstractStrategy
{
  constructor(private configService: ConfigService<EnvironmentDto, true>) {
    super({
      authorizationURL: 'https://osu.ppy.sh/oauth/authorize',
      tokenURL: 'https://osu.ppy.sh/oauth/token',
      callbackURL: `http://${configService.get('HOST')}/oauth/callback`,
      clientID: configService.get('OSU_CLIENT_ID'),
      clientSecret: configService.get('OSU_CLIENT_SECRET'),
      scope: 'identify',
    });
  }

  validate(accessToken: string, refreshToken: string): string {
    return refreshToken;
  }
}
