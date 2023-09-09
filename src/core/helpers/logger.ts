import { ConfigService } from '@nestjs/config';
import { INestApplication, LogLevel } from '@nestjs/common';
import { Env } from './env';

const configService = new ConfigService<Env, true>();

export function setupLogger(app: INestApplication) {
  const logLevels: LogLevel[] = configService.get('DEBUG')
    ? ['log', 'error', 'warn', 'debug', 'verbose']
    : ['log', 'error', 'warn'];

  app.useLogger(logLevels);
}
