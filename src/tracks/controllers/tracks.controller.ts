import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BucketService } from '../../bucket/services/bucket.service';

@ApiTags('Tracks')
@Controller()
export class TracksController {
  constructor(private bucketService: BucketService) {}

  // @Post('/tracks/:trackId/stream')
  // @HttpCode(200)
  // async create(@Param('trackId') trackId: string): Promise<StreamableFile> {}
}
