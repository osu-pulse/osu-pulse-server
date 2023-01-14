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
import { EnvironmentDto } from '../../core/dto/environment.dto';
import { ConfigService } from '@nestjs/config';
import { ReqAuth } from '../decorators/req-auth.decorator';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OsuAuthService } from '../../osu/services/osu-auth.service';
import { TokenSetModel } from '../models/token-set.model';
import { RotateTokenDto } from '../dto/rotate-token.dto';
import { tokenSetDtoConvertor } from '../convertors/token-set-dto.convertor';
import { TokenSetDto } from '../dto/token-set.dto';

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
  @Header('Cache-Control', 'no-store')
  @HttpCode(HttpStatus.TEMPORARY_REDIRECT)
  @Get('callback')
  async callback(
    @Res() res: Response,
    @ReqAuth() tokenSet: TokenSetModel,
  ): Promise<void> {
    const query = tokenSetDtoConvertor.fromTokenSetModel(tokenSet);
    const queryString = new URLSearchParams(query as any);

    return res.redirect(
      302,
      this.configService.get('URL_WEB_CLIENT') + '?' + queryString,
    );
  }

  @ApiOperation({
    summary: 'Rotates the tokens',
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
      return res.status(401);
    } else {
      return res
        .status(200)
        .send(tokenSetDtoConvertor.fromOsuTokenSet(tokenSet));
    }
  }
}
