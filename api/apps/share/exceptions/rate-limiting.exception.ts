import { HttpException, HttpStatus } from '@nestjs/common';
import { MessagesType } from '@share/interfaces';

export default class RateLimitingException extends HttpException {
  constructor(message: MessagesType) {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}
