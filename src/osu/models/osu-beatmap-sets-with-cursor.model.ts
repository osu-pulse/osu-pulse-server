import { OsuBeatmapSetModel } from './osu-beatmap-set.model';

export interface OsuBeatmapSetsWithCursorModel {
  data: OsuBeatmapSetModel[];
  cursor?: string;
}
