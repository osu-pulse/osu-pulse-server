import { ConfigService } from '@nestjs/config';
import { EnvironmentDto } from '../dto/environment.dto';
import { INestApplication, LogLevel } from '@nestjs/common';
import cookieParser from 'cookie-parser';

export function setupCookies(app: INestApplication) {
  const configService = app.get(ConfigService<EnvironmentDto, true>);

  app.use(cookieParser(configService.get('SECRET_COOKIE')));
}
