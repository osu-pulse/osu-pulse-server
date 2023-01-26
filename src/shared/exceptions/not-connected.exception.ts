import { HttpException, HttpStatus } from '@nestjs/common';

export class NotConnectedException extends HttpException {
  constructor() {
    super('Socket is not connected', HttpStatus.NOT_FOUND);
  }
}
