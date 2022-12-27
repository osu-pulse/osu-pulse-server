import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentDto } from '../dto/environment.dto';

export function setupCors(app: INestApplication) {
  const configService = app.get(ConfigService<EnvironmentDto, true>);

  app.enableCors({
    origin: configService.get('CORS'),
    credentials: configService.get('CORS'),
  });
}
