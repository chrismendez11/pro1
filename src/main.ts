import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  PrismaClientKnownRequestErrorFilter,
  PrismaClientUnknownRequestErrorFilter,
  PrismaClientValidationErrorFilter,
} from './shared/exception-filters/prisma/prisma-exception.filter';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  const logger = app.get(WINSTON_MODULE_PROVIDER);

  app.useGlobalFilters(
    new PrismaClientKnownRequestErrorFilter(logger),
    new PrismaClientUnknownRequestErrorFilter(logger),
    new PrismaClientValidationErrorFilter(logger),
  );

  const port = process.env.PORT || 3000;

  app.enableCors();
  await app.listen(port);
}
bootstrap();
