import { OsuBeatmapSet } from './osu-beatmap-set';

export interface OsuBeatmapSetsWithCursor {
  beatmapsets: OsuBeatmapSet[];
  cursor_string: string;
}
