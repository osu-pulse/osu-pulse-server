import { HttpException, HttpStatus } from '@nestjs/common';

export class RedirectUrlAbsentException extends HttpException {
  constructor() {
    super('Redirect url query not found', HttpStatus.BAD_REQUEST);
  }
}
