import { pick } from '../../shared/helpers/object';
import { kitsuApiUrl, osuOauthUrl } from '../../osu/constants/api-url';
import { TrackModel } from '../models/track.model';
import { ConfigService } from '@nestjs/config';
import { EnvironmentDto } from '../../core/dto/environment.dto';
import { BucketName } from '../../bucket/constants/bucket-name';
import { OsuBeatmapSet } from '../../osu/types/osu-beatmap-set';

export const trackConvertor = {
  fromBeatmapSet(beatmapSet: OsuBeatmapSet): TrackModel {
    const configService = new ConfigService<EnvironmentDto, true>();
    const host = configService.get('URL_MINIO');
    const bucket = BucketName.TRACKS;

    return {
      ...pick(beatmapSet, ['title', 'artist']),
      id: String(beatmapSet.id),
      cover: {
        small: beatmapSet.covers['list'],
        normal: beatmapSet.covers['list@2x'],
      },
      url: {
        page: `${osuOauthUrl}/beatmapsets/${beatmapSet.id}`,
        file: `${kitsuApiUrl}/audio/${beatmapSet.id}`,
        audio: `${host}/${bucket}/${beatmapSet.id}`,
      },
    };
  },
};
