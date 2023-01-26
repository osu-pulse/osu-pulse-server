import { HttpException, HttpStatus } from '@nestjs/common';

export class PlaylistNotFoundException extends HttpException {
  constructor() {
    super('Playlist not found', HttpStatus.NOT_FOUND);
  }
}
