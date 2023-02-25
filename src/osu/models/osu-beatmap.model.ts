import { OsuBeatmapSetModel } from './osu-beatmap-set.model';

export interface OsuBeatmapModel {
  id: number;
  total_length: number;
  beatmapset: Omit<OsuBeatmapSetModel, 'beatmaps'>;
}
