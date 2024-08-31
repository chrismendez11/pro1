import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { PrismaToHttpExceptionMapper } from './prisma-http-exception-mapper';
import { HttpStatusMessagesConstants } from '../../constants/http-status-messages.constants';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

/**
 * @see https://docs.nestjs.com/exception-filters Nestjs Exception Filters
 * @see https://www.prisma.io/docs/orm/reference/error-reference Prisma Error Message Reference
 */

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientKnownRequestErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const httpResponse = PrismaToHttpExceptionMapper.getHttpResponse(exception);
    const { message, statusCode, error } = httpResponse;
    const { method, url } = request;

    this.logger.error('PrismaClientKnownRequestError', {
      method,
      url,
      stack: exception,
    });
    response.status(statusCode).json({
      message,
      error,
      statusCode,
    });
  }
}

@Catch(Prisma.PrismaClientValidationError)
export class PrismaClientValidationErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  catch(
    exception: Prisma.PrismaClientUnknownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const { method, url } = request;

    this.logger.error('PrismaClientValidationError', {
      method,
      url,
      stack: exception,
    });
    response.status(status).json({
      message: HttpStatusMessagesConstants[status],
      statusCode: status,
    });
  }
}

@Catch(Prisma.PrismaClientUnknownRequestError)
export class PrismaClientUnknownRequestErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  catch(
    exception: Prisma.PrismaClientUnknownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const { method, url } = request;

    this.logger.error('PrismaClientUnknownRequestError', {
      method,
      url,
      stack: exception,
    });
    response.status(status).json({
      message: HttpStatusMessagesConstants[status],
      statusCode: status,
    });
  }
}
