import { pick } from '../../shared/helpers/object';
import { TrackModel } from '../models/track.model';
import { OsuBeatmapSet } from '../../osu/types/osu-beatmap-set';
import { OsuBeatmap } from '../../osu/types/osu-beatmap';

export const trackConvertor = {
  fromBeatmapSet(beatmapSet: OsuBeatmapSet): TrackModel {
    const beatmapId = Math.min(...beatmapSet.beatmaps.map(({ id }) => id));

    return {
      ...pick(beatmapSet, ['title', 'artist']),
      id: String(beatmapId),
      beatmapId: String(beatmapId),
      beatmapSetId: String(beatmapSet.id),
      played: beatmapSet.play_count,
      liked: beatmapSet.favourite_count,
      cover: {
        small: beatmapSet.covers['list'],
        normal: beatmapSet.covers['list@2x'],
      },
    };
  },
  fromBeatmap(beatmap: OsuBeatmap): TrackModel {
    return {
      ...pick(beatmap.beatmapset, ['title', 'artist']),
      id: String(beatmap.id),
      beatmapId: String(beatmap.id),
      beatmapSetId: String(beatmap.beatmapset.id),
      played: beatmap.beatmapset.play_count,
      liked: beatmap.beatmapset.favourite_count,
      cover: {
        small: beatmap.beatmapset.covers['list'],
        normal: beatmap.beatmapset.covers['list@2x'],
      },
    };
  },
};
