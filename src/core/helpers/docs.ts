import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';

const configService = new ConfigService<Env, true>();

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
