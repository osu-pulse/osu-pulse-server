import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OsuGuard } from '../guards/osu.guard';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Auth } from '../decorators/auth.decorator';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OsuOauthService } from '../../osu/services/osu-oauth.service';
import { CallbackResponse } from '../types/callback-response';
import { RotateTokenDto } from '../dto/rotate-token.dto';
import { tokenSetDtoConvertor } from '../convertors/token-set-dto.convertor';
import { TokenSetDto } from '../dto/token-set.dto';
import { plainToInstance } from 'class-transformer';
import { AuthService } from '../services/auth.service';
import { parseJwt } from '../helpers/jwt';
import { Env } from '../../core/helpers/env';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private configService: ConfigService<Env, true>,
    private osuAuthService: OsuOauthService,
    private authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Oauth authorize',
  })
  @ApiQuery({
    name: 'redirect_url',
    description: 'Url to redirect after authorization with tokens',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Authentication has been successfully started',
  })
  @UseGuards(OsuGuard)
  @HttpCode(HttpStatus.FOUND)
  @Get('authorize')
  async auth() {}

  @ApiOperation({
    summary: 'Oauth callback',
  })
  @ApiResponse({
    status: HttpStatus.TEMPORARY_REDIRECT,
    description: 'Authentication has been successfully completed',
  })
  @UseGuards(OsuGuard)
  @Header('Cache-Control', 'no-store')
  @HttpCode(HttpStatus.TEMPORARY_REDIRECT)
  @Get('callback')
  async callback(
    @Res() res: Response,
    @Auth() callback: CallbackResponse,
  ): Promise<void> {
    const userId = parseJwt(callback.accessToken).sub;
    await this.authService.registerUser(userId);

    const query = {
      access_token: callback.accessToken,
      refresh_token: callback.refreshToken,
      state: callback.state,
    };

    return res.redirect(
      HttpStatus.TEMPORARY_REDIRECT,
      `${callback.redirectUrl}?${new URLSearchParams(query)}`,
    );
  }

  @ApiOperation({
    summary: 'Token rotate',
  })
  @ApiOkResponse({
    description: 'The token has been successfully rotated',
    type: TokenSetDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token is invalid',
  })
  @Header('Cache-Control', 'no-store')
  @HttpCode(HttpStatus.OK)
  @Post('token')
  async token(
    @Res() res: Response,
    @Body() rotateToken: RotateTokenDto,
  ): Promise<Response> {
    const tokenSet = await this.osuAuthService.getTokenByRefreshToken(
      this.configService.get('OSU_CLIENT_ID'),
      this.configService.get('OSU_CLIENT_SECRET'),
      rotateToken.refresh_token,
    );

    if (!tokenSet) {
      return res.status(HttpStatus.UNAUTHORIZED);
    } else {
      const tokenSetDto = plainToInstance(
        TokenSetDto,
        tokenSetDtoConvertor.fromOsuTokenSetModel(tokenSet),
      );

      return res.status(HttpStatus.OK).send(tokenSetDto);
    }
  }
}
