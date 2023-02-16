import { ConfigService } from '@nestjs/config';
import { INestApplication, LogLevel } from '@nestjs/common';
import { EnvModel } from '../models/env.model';

const configService = new ConfigService<EnvModel, true>();

export function setupLogger(app: INestApplication) {
  const logLevels: LogLevel[] = configService.get('DEBUG')
    ? ['log', 'error', 'warn', 'debug', 'verbose']
    : ['log', 'error', 'warn'];

  app.useLogger(logLevels);
}
