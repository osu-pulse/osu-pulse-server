import { pick } from '../../shared/helpers/object';
import { TrackModel } from '../models/track.model';
import { OsuBeatmapSetModel } from '../../osu/models/osu-beatmap-set.model';
import { OsuBeatmapModel } from '../../osu/models/osu-beatmap.model';

export const trackModelConvertor = {
  fromOsuBeatmapSetModel(beatmapSet: OsuBeatmapSetModel): TrackModel {
    const beatmapId = Math.min(...beatmapSet.beatmaps.map(({ id }) => id));
    const beatmap = beatmapSet.beatmaps.find(({ id }) => id === beatmapId);

    return {
      ...pick(beatmapSet, ['title', 'artist']),
      id: String(beatmapId),
      beatmapId: String(beatmapId),
      beatmapSetId: String(beatmapSet.id),
      duration: beatmap.total_length,
      played: beatmapSet.play_count,
      liked: beatmapSet.favourite_count,
    };
  },
  fromOsuBeatmapModel(beatmap: OsuBeatmapModel): TrackModel {
    return {
      ...pick(beatmap.beatmapset, ['title', 'artist']),
      id: String(beatmap.id),
      beatmapId: String(beatmap.id),
      beatmapSetId: String(beatmap.beatmapset.id),
      duration: beatmap.total_length,
      played: beatmap.beatmapset.play_count,
      liked: beatmap.beatmapset.favourite_count,
    };
  },
};
