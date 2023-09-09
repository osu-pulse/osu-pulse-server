import Strategy from 'passport-osu';
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CallbackResponse } from '../types/callback-response';
import { Request } from 'express';
import { RedirectUrlAbsentException } from '../exceptions/redirect-url-absent.exception';
import { InvalidStateException } from '../exceptions/invalid-state.exception';
import { stateConvertor } from '../convertors/state.convertor';
import { Env } from '../../core/helpers/env';
import { CacheManagerService } from '../../shared/services/cache-manager.service';

@Injectable()
export class OsuStrategy
  extends PassportStrategy(Strategy, 'osu')
  implements AbstractStrategy
{
  constructor(
    private cacheManagerService: CacheManagerService,
    private configService: ConfigService<Env, true>,
  ) {
    super({
      callbackURL: `${configService.get('URL_AUTH')}/callback`,
      clientID: configService.get('OSU_CLIENT_ID'),
      clientSecret: configService.get('OSU_CLIENT_SECRET'),
      passReqToCallback: true,
    });
  }

  async authenticate(
    req: Request,
    options?: Record<string, unknown>,
  ): Promise<void> {
    if (req.route.path.endsWith('callback')) {
      return super.authenticate(req, options);
    }

    const redirectUrl = req.query.redirect_url as string;
    if (!redirectUrl) {
      throw new RedirectUrlAbsentException();
    }

    const state = stateConvertor.toExternal(req.query.state as string);

    await this.cacheManagerService.set(
      'auth:redirect-url:',
      state,
      redirectUrl,
    );

    super.authenticate(req, { ...options, state });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
  ): Promise<CallbackResponse> {
    const state = req.query.state as string;

    const redirectUrl = await this.cacheManagerService.pop<string>(
      'auth:redirect-url:',
      state,
    );
    if (!redirectUrl) {
      throw new InvalidStateException();
    }

    return {
      state: stateConvertor.fromExternal(state),
      redirectUrl,
      accessToken,
      refreshToken,
    };
  }
}
