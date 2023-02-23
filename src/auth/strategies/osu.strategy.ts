import Strategy from 'passport-osu';
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CallbackResponseModel } from '../models/callback-response.model';
import { EnvModel } from '../../core/models/env.model';
import { Request } from 'express';
import * as crypto from 'crypto';
import { RedirectUrlAbsentException } from '../exceptions/redirect-url-absent.exception';
import { InvalidStateException } from '../exceptions/invalid-state.exception';
import { Session } from '../types/session';

@Injectable()
export class OsuStrategy
  extends PassportStrategy(Strategy, 'osu')
  implements AbstractStrategy
{
  private states: Map<string, Session>;

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
    if (!req.url.includes('callback')) {
      const redirectUrl = req.query.redirect_url as string;
      if (!redirectUrl) {
        throw new RedirectUrlAbsentException();
      }

      const state = req.query.state as string;
      const id = crypto.randomUUID();

      this.states.set(id, { redirectUrl, state });
      setTimeout(() => this.states.delete(state), 3600 * 1000);

      super.authenticate(req, { ...options, state: id });
    } else {
      super.authenticate(req, options);
    }
  }

  validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
  ): CallbackResponseModel {
    const id = req.query.state as string;

    if (!this.states.has(id)) {
      throw new InvalidStateException();
    }

    const session = this.states.get(id);
    this.states.delete(id);

    return {
      session,
      accessToken,
      refreshToken,
    };
  }
}
