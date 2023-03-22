import { HttpException, HttpStatus } from '@nestjs/common';

export class TrackNotInLibraryException extends HttpException {
  constructor() {
    super('Track not in library', HttpStatus.CONFLICT);
  }
}
