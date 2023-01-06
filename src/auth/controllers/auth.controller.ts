import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { OsuAuthGuard } from '../guards/osu-auth.guard';
import { CookieOptions, Response } from 'express';
import { EnvironmentDto } from '../../core/dto/environment.dto';
import { ConfigService } from '@nestjs/config';
import { ReqAuth } from '../decorators/req-auth.decorator';
import { ReqCookies } from '../decorators/req-cookies.decorator';
import { Cookies } from '../types/cookies';
import { NodeEnv } from '../../core/constants/node-env';
import dayjs from 'dayjs';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';
import { AuthContext } from '../types/auth-request';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService<EnvironmentDto, true>,
  ) {}

  private get cookieOptions(): CookieOptions {
    return {
      secure: this.configService.get('NODE_ENV') === NodeEnv.DEVELOPMENT,
      path: '/auth/token',
      signed: true,
      httpOnly: true,
      sameSite: 'strict',
      expires: dayjs().add(30, 'days').toDate(),
    };
  }

  @Get()
  @UseGuards(OsuAuthGuard)
  async auth() {}

  @Get('callback')
  @UseGuards(OsuAuthGuard)
  async callback(
    @Res() res: Response,
    @ReqAuth() userId: AuthContext,
    @ReqCookies() cookies,
  ): Promise<void> {
    const refreshToken = await this.authService.generateRefreshToken(userId);

    res
      .cookie('refreshToken', refreshToken, this.cookieOptions)
      .redirect(301, `http://${this.configService.get('HOST')}`);
  }

  @Get('token')
  async token(@Res() res: Response, @ReqCookies() cookies): Promise<void> {
    const pair = await this.authService.generateTokenPair(cookies.refreshToken);

    if (!pair) {
      throw new UnauthorizedException();
    }

    res
      .cookie('refreshToken', pair.refreshToken, this.cookieOptions)
      .status(200)
      .send(pair.accessToken);
  }
}
