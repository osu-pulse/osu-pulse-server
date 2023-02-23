import { HttpException, HttpStatus } from '@nestjs/common';

export class RedirectUrlAbsentException extends HttpException {
  constructor() {
    super('Redirect url absent', HttpStatus.BAD_REQUEST);
  }
}
