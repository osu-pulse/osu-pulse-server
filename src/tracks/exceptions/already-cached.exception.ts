import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyCachedException extends HttpException {
  constructor() {
    super('Track already cached', HttpStatus.CONFLICT);
  }
}
