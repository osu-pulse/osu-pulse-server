import Strategy from 'passport-osu';
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CallbackResponse } from '../types/callback-response';
import { EnvModel } from '../../core/models/env.model';
import { Request } from 'express';
import { RedirectUrlAbsentException } from '../exceptions/redirect-url-absent.exception';
import { InvalidStateException } from '../exceptions/invalid-state.exception';
import { stateConvertor } from '../convertors/state.convertor';

@Injectable()
export class OsuStrategy
  extends PassportStrategy(Strategy, 'osu')
  implements AbstractStrategy
{
  private states: Map<string, string>;

  constructor(private configService: ConfigService<EnvModel, true>) {
    super({
      callbackURL: `${configService.get('URL_AUTH')}/callback`,
      clientID: configService.get('OSU_CLIENT_ID'),
      clientSecret: configService.get('OSU_CLIENT_SECRET'),
      passReqToCallback: true,
    });

    this.states = new Map();
  }

  authenticate(req: Request, options?: Record<string, unknown>) {
    if (!req.route.path.endsWith('callback')) {
      return super.authenticate(req, options);
    }

    const redirectUrl = req.query.redirect_url as string;
    if (!redirectUrl) {
      throw new RedirectUrlAbsentException();
    }

    const state = stateConvertor.toExternal(req.query.state as string);

    this.states.set(state, redirectUrl);
    setTimeout(() => this.states.delete(state), 24 * 60 * 60 * 1000);

    super.authenticate(req, { ...options, state });
  }

  validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
  ): CallbackResponse {
    const state = req.query.state as string;
    if (!this.states.has(state)) {
      throw new InvalidStateException();
    }

    const redirectUrl = this.states.get(state);
    this.states.delete(state);

    return {
      state: stateConvertor.fromExternal(state),
      redirectUrl,
      accessToken,
      refreshToken,
    };
  }
}
