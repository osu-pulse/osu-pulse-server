import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { OauthStrategy } from './strategies/oauth.strategy';
import { OauthController } from './controllers/oauth.controller';
import { OsuStrategy } from './strategies/osu.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RefreshTokenModel,
  RefreshTokenSchema,
} from './models/refresh-token.model';
import { OsuModule } from '../osu/osu.module';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    forwardRef(() => OsuModule),
    MongooseModule.forFeature([
      { name: RefreshTokenModel.name, schema: RefreshTokenSchema },
    ]),
  ],
  providers: [OauthStrategy, OsuStrategy, AuthService],
  controllers: [OauthController],
  exports: [OauthStrategy, AuthService],
})
export class AuthModule {}
