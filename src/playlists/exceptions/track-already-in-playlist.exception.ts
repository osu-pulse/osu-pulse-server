import { HttpException, HttpStatus } from '@nestjs/common';

export class TrackAlreadyInPlaylistException extends HttpException {
  constructor() {
    super('Track already in playlist', HttpStatus.CONFLICT);
  }
}
