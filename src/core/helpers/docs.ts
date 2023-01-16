import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { RedocModule } from 'nestjs-redoc';

export async function setupDocs(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('osu! Pulse')
    .setDescription('The multifunctional music player for osu')
    .setVersion('1.0')
    .addServer('/api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/swagger', app, document, { explorer: true });
  await RedocModule.setup('/redoc', app, document, {
    logo: {
      url: 'https://github.com/osu-pulse/.github/blob/main/assets/icon.png?raw=true',
    },
  });
}
