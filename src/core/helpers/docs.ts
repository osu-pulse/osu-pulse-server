import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupDocs(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('osu! Pulse')
    .setDescription('The multifunctional music player for osu')
    .setVersion('1.0')
    .addServer('/api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document, { explorer: true });
}
