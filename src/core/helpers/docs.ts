import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvModel } from '../models/env.model';

const configService = new ConfigService<EnvModel, true>();

export function setupDocs(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('osu! Pulse')
    .setDescription('The multifunctional music player for osu')
    .setVersion('1.0')
    .addServer(configService.get('URL_API'))
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document, { explorer: true });
}
