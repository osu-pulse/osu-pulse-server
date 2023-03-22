import { HttpException, HttpStatus } from '@nestjs/common';

export class TrackAlreadyInLibraryException extends HttpException {
  constructor() {
    super('Track already in library', HttpStatus.CONFLICT);
  }
}
