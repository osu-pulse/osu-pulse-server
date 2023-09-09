import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';

export function setupCors(app: INestApplication) {
  const configService = app.get(ConfigService<Env, true>);

  if (configService.get('CORS')) {
    app.enableCors({ origin: true, credentials: true });
  }
}
