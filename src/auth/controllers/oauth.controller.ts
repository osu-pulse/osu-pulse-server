import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OsuGuard } from '../guards/osu.guard';
import { CookieOptions, Response } from 'express';
import { EnvironmentDto } from '../../core/dto/environment.dto';
import { ConfigService } from '@nestjs/config';
import { ReqAuth } from '../decorators/req-auth.decorator';
import { ReqCookies } from '../decorators/req-cookies.decorator';
import { Cookies } from '../types/cookies';
import { NodeEnv } from '../../core/constants/node-env';
import dayjs from 'dayjs';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OsuService } from '../../osu/services/osu.service';
import { OsuAuthService } from '../../osu/services/osu-auth.service';

@ApiTags('Authorization')
@Controller('oauth')
export class OauthController {
  constructor(
    private configService: ConfigService<EnvironmentDto, true>,
    private osuAuthService: OsuAuthService,
  ) {}

  @ApiOperation({
    summary: 'Redirects to the oauth app authentication page',
  })
  @ApiResponse({
    status: HttpStatus.TEMPORARY_REDIRECT,
    description: 'Authentication has been successfully started',
  })
  @UseGuards(OsuGuard)
  @HttpCode(HttpStatus.TEMPORARY_REDIRECT)
  @Get('authorize')
  async auth() {}

  @ApiOperation({
    summary:
      'Receives the authorization code from oauth app and redirects to the root of app',
  })
  @ApiResponse({
    status: HttpStatus.TEMPORARY_REDIRECT,
    description: 'Authentication has been successfully completed',
  })
  @UseGuards(OsuGuard)
  @HttpCode(HttpStatus.TEMPORARY_REDIRECT)
  @Get('callback')
  async callback(
    @Res() res: Response,
    @ReqAuth() refreshToken: string,
    @ReqCookies() cookies: Cookies<'refreshToken'>,
  ): Promise<void> {
    res
      .cookie('refreshToken', refreshToken, this.cookieOptions)
      .redirect(302, this.configService.get('URL_WEB_CLIENT'));
  }

  @ApiOperation({
    summary: 'Rotates the tokens',
  })
  @ApiOkResponse({
    description: 'The token has been successfully rotated',
    type: String,
  })
  @Header('Cache-Control', 'no-store')
  @HttpCode(HttpStatus.OK)
  @Get('token')
  async token(
    @Res() res: Response,
    @ReqCookies() cookies: Cookies<'refreshToken'>,
  ): Promise<void> {
    const tokenSet = await this.osuAuthService.getTokenByRefreshToken(
      this.configService.get('OSU_CLIENT_ID'),
      this.configService.get('OSU_CLIENT_SECRET'),
      cookies.refreshToken,
    );

    res
      .cookie('refreshToken', tokenSet.refresh_token, this.cookieOptions)
      .status(200)
      .send(tokenSet.access_token);
  }

  private get cookieOptions(): CookieOptions {
    return {
      secure: this.configService.get('NODE_ENV') === NodeEnv.DEVELOPMENT,
      path: '/oauth/token',
      signed: true,
      httpOnly: true,
      sameSite: 'strict',
      expires: dayjs().add(30, 'days').toDate(),
    };
  }
}
