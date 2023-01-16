import { HttpException, HttpStatus } from '@nestjs/common';

export class TrackNotFoundException extends HttpException {
  constructor() {
    super('Track not found', HttpStatus.NOT_FOUND);
  }
}
