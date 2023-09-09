import { OsuBeatmapSet } from './osu-beatmap-set';

export interface OsuBeatmap {
  id: number;
  total_length: number;
  beatmapset: Omit<OsuBeatmapSet, 'beatmaps'>;
}
