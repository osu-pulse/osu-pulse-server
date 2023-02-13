import { HttpException, HttpStatus } from '@nestjs/common';

export class CacheCanceledException extends HttpException {
  constructor() {
    super('Caching track canceled', HttpStatus.GONE);
  }
}
