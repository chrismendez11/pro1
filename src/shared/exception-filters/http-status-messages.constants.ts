import { HttpStatus } from '@nestjs/common';

export class HttpStatusMessagesConstants {
  static readonly [HttpStatus.INTERNAL_SERVER_ERROR] = 'Internal server error';
  static readonly [HttpStatus.CONFLICT] = 'Conflict';
  static readonly [HttpStatus.NOT_FOUND] = 'Not found';
  static readonly [HttpStatus.BAD_REQUEST] = 'Bad request';
  static readonly [HttpStatus.UNAUTHORIZED] = 'Unauthorized';
  static readonly [HttpStatus.FORBIDDEN] = 'Forbidden';
}
