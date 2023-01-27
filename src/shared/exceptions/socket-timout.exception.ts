import { HttpException, HttpStatus } from '@nestjs/common';

export class SocketTimeoutException extends HttpException {
  constructor() {
    super('Camera response timed out', HttpStatus.REQUEST_TIMEOUT);
  }
}
