import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import appConfig from './config/server.config';

const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appConfig(app);

  app.enableCors();

  await app.listen(configService.get<number>('PORT') || 3000);
}
bootstrap();
