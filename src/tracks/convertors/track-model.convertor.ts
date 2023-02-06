import { pick } from '../../shared/helpers/object';
import { TrackModel } from '../models/track.model';
import { OsuBeatmapSet } from '../../osu/types/osu-beatmap-set';
import { OsuBeatmap } from '../../osu/types/osu-beatmap';
import { osuAssetsUrl } from '../../osu/constants/api-url';

export const trackModelConvertor = {
  fromOsuBeatmapSet(beatmapSet: OsuBeatmapSet): TrackModel {
    const beatmapId = Math.min(...beatmapSet.beatmaps.map(({ id }) => id));

    return {
      ...pick(beatmapSet, ['title', 'artist']),
      id: String(beatmapId),
      beatmapId: String(beatmapId),
      beatmapSetId: String(beatmapSet.id),
      played: beatmapSet.play_count,
      liked: beatmapSet.favourite_count,
      cover: {
        small: `${osuAssetsUrl}/beatmaps/${beatmapSet.id}/list.jpg`,
        normal: `${osuAssetsUrl}/beatmaps/${beatmapSet.id}/list@2x.jpg`,
      },
    };
  },
  fromOsuBeatmap(beatmap: OsuBeatmap): TrackModel {
    return {
      ...pick(beatmap.beatmapset, ['title', 'artist']),
      id: String(beatmap.id),
      beatmapId: String(beatmap.id),
      beatmapSetId: String(beatmap.beatmapset.id),
      played: beatmap.beatmapset.play_count,
      liked: beatmap.beatmapset.favourite_count,
      cover: {
        small: `${osuAssetsUrl}/beatmaps/${beatmap.beatmapset.id}/list.jpg`,
        normal: `${osuAssetsUrl}/beatmaps/${beatmap.beatmapset.id}/list@2x.jpg`,
      },
    };
  },
};
