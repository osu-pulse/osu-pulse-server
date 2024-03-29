import { pick } from '../../shared/helpers/object';
import { Track } from '../types/track';
import { OsuBeatmapSet } from '../../osu/types/osu-beatmap-set';
import { OsuBeatmap } from '../../osu/types/osu-beatmap';

export const trackConvertor = {
  fromOsuBeatmapSet(beatmapSet: OsuBeatmapSet): Track {
    const beatmap = beatmapSet.beatmaps[0];

    return {
      ...pick(beatmapSet, ['title', 'artist']),
      id: String(beatmap.id),
      beatmapId: String(beatmap.id),
      beatmapSetId: String(beatmapSet.id),
      played: beatmapSet.play_count,
      liked: beatmapSet.favourite_count,
      duration: beatmap.total_length,
    };
  },
  fromOsuBeatmap(beatmap: OsuBeatmap): Track {
    return {
      ...pick(beatmap.beatmapset, ['title', 'artist']),
      id: String(beatmap.id),
      beatmapId: String(beatmap.id),
      beatmapSetId: String(beatmap.beatmapset.id),
      played: beatmap.beatmapset.play_count,
      liked: beatmap.beatmapset.favourite_count,
      duration: beatmap.total_length,
    };
  },
};
