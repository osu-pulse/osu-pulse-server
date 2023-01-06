import { ExtractJwt, Strategy } from 'passport-jwt';
import { AbstractStrategy, PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentDto } from '../../core/dto/environment.dto';
import { JwtPayload } from '../types/jwt-payload';
import { AuthContext } from '../types/auth-request';

@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy)
  implements AbstractStrategy
{
  constructor(private configService: ConfigService<EnvironmentDto, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      issuer: configService.get('HOST'),
    });
  }

  validate(payload: JwtPayload): AuthContext {
    return payload.sub;
  }
}
