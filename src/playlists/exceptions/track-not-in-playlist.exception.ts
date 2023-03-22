import { HttpException, HttpStatus } from '@nestjs/common';

export class TrackNotInPlaylistException extends HttpException {
  constructor() {
    super('Track not in playlist', HttpStatus.CONFLICT);
  }
}
