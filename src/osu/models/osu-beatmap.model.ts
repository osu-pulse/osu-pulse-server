import { OsuBeatmapSetModel } from './osu-beatmap-set.model';

export interface OsuBeatmapModel {
  id: number;
  beatmapset: Omit<OsuBeatmapSetModel, 'beatmaps'>;
}
