import Strategy, { PassportProfile } from 'passport-osu';
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentDto } from '../../core/dto/environment.dto';
import { AuthContext } from '../types/auth-request';

@Injectable()
export class OsuStrategy
  extends PassportStrategy(Strategy)
  implements AbstractStrategy
{
  constructor(private configService: ConfigService<EnvironmentDto, true>) {
    super({
      clientID: configService.get('OSU_CLIENT_ID'),
      clientSecret: configService.get('OSU_CLIENT_SECRET'),
      callbackURL: `http://${configService.get('HOST')}/oauth/callback`,
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: PassportProfile,
  ): AuthContext {
    return refreshToken;
  }
}
