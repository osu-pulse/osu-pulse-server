import { ConfigService } from '@nestjs/config';
import { INestApplication, LogLevel } from '@nestjs/common';
import { Env } from '../types/env';

export function setupLogger(app: INestApplication) {
  const configService = app.get(ConfigService<Env, true>);

  const logLevels: LogLevel[] = configService.get('DEBUG')
    ? ['log', 'error', 'warn', 'debug', 'verbose']
    : ['log', 'error', 'warn'];

  app.useLogger(logLevels);
}
