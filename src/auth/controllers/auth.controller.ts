import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
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
import {
  ApiMovedPermanentlyResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('/oauth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService<EnvironmentDto, true>,
  ) {}

  @ApiOperation({
    summary: 'Redirects to the oauth app authentication page',
  })
  @ApiResponse({
    status: HttpStatus.TEMPORARY_REDIRECT,
    description: 'Authentication has been successfully started',
  })
  @UseGuards(OsuAuthGuard)
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
  @UseGuards(OsuAuthGuard)
  @HttpCode(HttpStatus.TEMPORARY_REDIRECT)
  @Get('callback')
  async callback(
    @Res() res: Response,
    @ReqAuth() userId: AuthContext,
    @ReqCookies() cookies: Cookies<'refreshToken'>,
  ): Promise<void> {
    const refreshToken = await this.authService.generateRefreshToken(userId);

    res
      .cookie('refreshToken', refreshToken, this.cookieOptions)
      .redirect(302, `http://${this.configService.get('HOST')}`);
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
    const tokenSet = await this.authService.rotateToken(cookies.refreshToken);

    if (!tokenSet) {
      throw new UnauthorizedException();
    }

    res
      .cookie('refreshToken', tokenSet.refreshToken, this.cookieOptions)
      .status(200)
      .send(tokenSet.accessToken);
  }

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
}
