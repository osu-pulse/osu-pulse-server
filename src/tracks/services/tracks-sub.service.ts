import { Inject, Injectable } from '@nestjs/common';
import { OsuService } from '../../osu/services/osu.service';
import { trackConvertor } from '../convertors/track.convertor';
import { TracksWithCursorModel } from '../models/tracks-with-cursor.model';
import { TrackModel } from '../models/track.model';
import { BucketService } from '../../bucket/services/bucket.service';
import { KitsuService } from '../../osu/services/kitsu.service';
import { BucketName } from '../../bucket/constants/bucket-name';
import { AudioFileType } from '../../bucket/constants/file-type';
import { GRAPHQL_PUB_SUB } from '../../shared/constants/injections';
import { PubSub } from 'graphql-subscriptions';
import { SubService } from '../../shared/helpers/sub-service';

@Injectable()
export class TracksSubService extends SubService<{
  (trigger: 'trackCached', payload: string): void;
}> {
  constructor(@Inject(GRAPHQL_PUB_SUB) pubSub: PubSub) {
    super(pubSub);
  }
}
