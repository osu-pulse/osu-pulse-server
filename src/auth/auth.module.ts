import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { OauthStrategy } from './strategies/oauth.strategy';
import { OauthController } from './controllers/oauth.controller';
import { OsuStrategy } from './strategies/osu.strategy';
import { OsuModule } from '../osu/osu.module';
import { AuthService } from './services/auth.service';
import { AccessTokenHolderInterceptor } from './interceptors/access-token-holder.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenHolderService } from './services/access-token-holder.service';

@Module({
  imports: [ConfigModule, PassportModule, forwardRef(() => OsuModule)],
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
  controllers: [OauthController],
  exports: [OauthStrategy, AuthService, AccessTokenHolderService],
})
export class AuthModule {}
