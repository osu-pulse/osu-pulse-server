import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidStateException extends HttpException {
  constructor() {
    super('Invalid state', HttpStatus.UNAUTHORIZED);
  }
}
