import { pick } from '../../shared/helpers/object.helper';
import { osuUrl } from '../../osu/constants/osu-url';
import { TrackModel } from '../models/track.model';
import { BeatmapSetDto } from '../../osu/dto/beatmap-set.dto';

export const trackConvertor = {
  fromBeatmapSet(beatmapSubset: BeatmapSetDto): TrackModel {
    return {
      ...pick(beatmapSubset, ['id', 'title', 'artist']),
      cover: {
        small: beatmapSubset.covers['list'],
        normal: beatmapSubset.covers['list@2x'],
      },
      url: `${osuUrl}/beatmapsets/${beatmapSubset.id}`,
    };
  },
};
