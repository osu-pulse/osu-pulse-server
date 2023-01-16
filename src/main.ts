import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupDocs } from './core/helpers/docs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupCors } from './core/helpers/cors';
import { setupLogger } from './core/helpers/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  await setupDocs(app);
  setupCors(app);
  setupLogger(app);

  await app.listen(5000, '0.0.0.0');
}

bootstrap().then();
