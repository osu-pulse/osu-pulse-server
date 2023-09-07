import { OsuBeatmapSet } from './osu-beatmap-set';

export interface OsuBeatmapSetsWithCursor {
  data: OsuBeatmapSet[];
  cursor?: string;
}
