import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  PrismaClientKnownRequestErrorFilter,
  PrismaClientUnknownRequestErrorFilter,
  PrismaClientValidationErrorFilter,
} from './shared/exception-filters/prisma/prisma-exception.filter';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(
    new PrismaClientKnownRequestErrorFilter(),
    new PrismaClientUnknownRequestErrorFilter(),
    new PrismaClientValidationErrorFilter(),
  );

  app.enableCors();
  await app.listen(port);
}
bootstrap();
