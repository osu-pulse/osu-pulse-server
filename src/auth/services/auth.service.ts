import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayload } from '../types/jwt-payload';
import { TokenSet } from '../types/token-set';
import { RefreshTokensService } from './refresh-tokens.service';
import { use } from 'passport';
import { ConfigService } from '@nestjs/config';
import { EnvironmentDto } from '../../core/dto/environment.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<EnvironmentDto, true>,
    private refreshTokensService: RefreshTokensService,
  ) {}

  async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = await this.refreshTokensService.create(userId);
    return refreshToken.value;
  }

  async generateTokenPair(refreshToken: string): Promise<TokenSet | null> {
    const newRefreshToken = await this.refreshTokensService.refreshValue(
      refreshToken,
    );
    if (!newRefreshToken) {
      return null;
    }

    const payload: JwtPayload = { sub: newRefreshToken.userId };
    const options: JwtSignOptions = {
      secret: this.configService.get('JWT_SECRET'),
      issuer: this.configService.get('HOST'),
      notBefore: new Date().getSeconds(),
      expiresIn: '5m',
    };

    return {
      accessToken: this.jwtService.sign(payload, options),
      refreshToken: newRefreshToken.value,
    };
  }
}
