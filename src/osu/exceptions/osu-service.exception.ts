import { HttpException, HttpStatus } from '@nestjs/common';

export class OsuServiceException extends HttpException {
  constructor(error: string) {
    super(error, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
