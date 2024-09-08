import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HttpStatusMessagesConstants } from '../../constants/http-status-messages.constants';

interface IHttpResponse {
  message: string;
  error?: string;
  statusCode: HttpStatus;
}

class PrismaErrorCodesConstants {
  static readonly RecordDoesNotExist = 'P2025';
  static readonly RecordAlreadyExists = 'P2002';
  static readonly InvalidForeignKey = 'P2003';
}

class PrismaErrorCodesToHttpStatusCodes {
  private static readonly map: Record<string, HttpStatus> = {
    [PrismaErrorCodesConstants.RecordDoesNotExist]: HttpStatus.NOT_FOUND,
    [PrismaErrorCodesConstants.RecordAlreadyExists]: HttpStatus.CONFLICT,
    [PrismaErrorCodesConstants.InvalidForeignKey]: HttpStatus.BAD_REQUEST,
  };

  static getHttpStatus(code: string) {
    return this.map[code] || HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

export class PrismaToHttpExceptionMapper {
  /**
   * @description Maps Prisma error codes to HTTP status codes
   */
  static getHttpResponse(
    exception: Prisma.PrismaClientKnownRequestError,
  ): IHttpResponse {
    const { code, meta, message: exceptionMessage } = exception;

    const statusCode = PrismaErrorCodesToHttpStatusCodes.getHttpStatus(code);
    let message = HttpStatusMessagesConstants[statusCode];
    let error: string;

    switch (code) {
      case PrismaErrorCodesConstants.InvalidForeignKey:
        error = HttpStatusMessagesConstants[statusCode];
        message = `Invalid '${meta.field_name}' provided`;
        break;
      case PrismaErrorCodesConstants.RecordAlreadyExists:
        error = HttpStatusMessagesConstants[statusCode];
        message = `Record '${meta.modelName}' already exists`;
        break;
      case PrismaErrorCodesConstants.RecordDoesNotExist:
        error = HttpStatusMessagesConstants[statusCode];
        message = meta
          ? `Record '${meta.modelName}' not found`
          : exceptionMessage;
        break;
    }

    return {
      message,
      error,
      statusCode,
    };
  }
}
