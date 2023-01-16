import { ConfigService } from '@nestjs/config';
import { EnvironmentDto } from '../dto/environment.dto';
import { INestApplication, LogLevel } from '@nestjs/common';

export function setupLogger(app: INestApplication) {
  const configService = app.get(ConfigService<EnvironmentDto, true>);

  const logLevels: LogLevel[] = configService.get('DEBUG')
    ? ['log', 'error', 'warn', 'debug', 'verbose']
    : ['log', 'error', 'warn'];

  app.useLogger(logLevels);
}
