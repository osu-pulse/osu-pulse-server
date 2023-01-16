import { OsuBeatmapSet } from './osu-beatmap-set';

export interface OsuBeatmap {
  id: number;
  beatmapset: Omit<OsuBeatmapSet, 'beatmaps'>;
}
