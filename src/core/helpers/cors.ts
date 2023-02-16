import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvModel } from '../models/env.model';

export function setupCors(app: INestApplication) {
  const configService = app.get(ConfigService<EnvModel, true>);

  if (configService.get('CORS')) {
    app.enableCors({ origin: true, credentials: true });
  }
}
