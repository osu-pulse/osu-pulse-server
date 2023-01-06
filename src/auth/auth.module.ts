import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentDto } from '../core/dto/environment.dto';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { OsuStrategy } from './strategies/osu.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RefreshTokenModel,
  RefreshTokenSchema,
} from './models/refresh-token.model';
import { RefreshTokensService } from './services/refresh-tokens.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule,
    MongooseModule.forFeature([
      { name: RefreshTokenModel.name, schema: RefreshTokenSchema },
    ]),
  ],
  providers: [AuthService, RefreshTokensService, JwtStrategy, OsuStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy],
})
export class AuthModule {}
