import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidTrackPositionException extends HttpException {
  constructor() {
    super('Invalid track position', HttpStatus.BAD_REQUEST);
  }
}
