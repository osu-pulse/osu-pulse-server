import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { OauthStrategy } from './strategies/oauth.strategy';
import { AuthController } from './controllers/auth.controller';
import { OsuStrategy } from './strategies/osu.strategy';
import { OsuModule } from '../osu/osu.module';
import { AuthService } from './services/auth.service';
import { AccessTokenHolderInterceptor } from './interceptors/access-token-holder.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenHolderService } from './services/access-token-holder.service';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    forwardRef(() => OsuModule),
    forwardRef(() => TracksModule),
  ],
  providers: [
    OauthStrategy,
    OsuStrategy,
    AuthService,
    AccessTokenHolderService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AccessTokenHolderInterceptor,
    },
  ],
  controllers: [AuthController],
  exports: [OauthStrategy, AuthService, AccessTokenHolderService],
})
export class AuthModule {}
