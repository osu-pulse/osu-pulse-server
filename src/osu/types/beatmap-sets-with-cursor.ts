import { BeatmapSet } from './beatmap-set';

export interface BeatmapSetsWithCursor {
  beatmapsets: BeatmapSet[];
  cursor_string: string;
}
