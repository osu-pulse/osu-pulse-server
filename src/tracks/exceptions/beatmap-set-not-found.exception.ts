import { HttpException, HttpStatus } from '@nestjs/common';

export class BeatmapSetNotFoundException extends HttpException {
  constructor() {
    super('Beatmap set not found', HttpStatus.NOT_FOUND);
  }
}
