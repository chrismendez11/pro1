import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { PrismaToHttpExceptionMapper } from './prisma-http-exception-mapper';
import { HttpStatusMessagesConstants } from '../http-status-messages.constants';

/**
 * @see https://docs.nestjs.com/exception-filters Nestjs Exception Filters
 * @see https://www.prisma.io/docs/orm/reference/error-reference Prisma Error Message Reference
 */

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientKnownRequestErrorFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log(exception);
    const httpResponse = PrismaToHttpExceptionMapper.getHttpResponse(exception);
    const { message, statusCode, error } = httpResponse;

    response.status(statusCode).json({
      message,
      error,
      statusCode,
    });
  }
}

@Catch(Prisma.PrismaClientValidationError)
export class PrismaClientValidationErrorFilter implements ExceptionFilter {
  catch(
    _exception: Prisma.PrismaClientUnknownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    console.log(_exception);
    response.status(status).json({
      message: HttpStatusMessagesConstants[status],
      statusCode: status,
    });
  }
}

@Catch(Prisma.PrismaClientUnknownRequestError)
export class PrismaClientUnknownRequestErrorFilter implements ExceptionFilter {
  catch(
    _exception: Prisma.PrismaClientUnknownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    console.log(_exception);
    response.status(status).json({
      message: HttpStatusMessagesConstants[status],
      statusCode: status,
    });
  }
}
