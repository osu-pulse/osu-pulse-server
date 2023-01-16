import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './core/helpers/swagger.helper';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupCors } from './core/helpers/cors.helper';
import { setupLogger } from './core/helpers/logger.helper';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  setupCors(app);
  setupSwagger(app);
  setupLogger(app);

  await app.listen(5000, '0.0.0.0');
}

bootstrap().then();
