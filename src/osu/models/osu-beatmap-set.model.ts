import { OsuBeatmapModel } from './osu-beatmap.model';

export interface OsuBeatmapSetModel {
  id: number;
  title: string;
  artist: string;
  beatmaps: Omit<OsuBeatmapModel, 'beatmapset'>[];
  favourite_count: number;
  play_count: number;
  covers: {
    list: string;
    'list@2x': string;
    'slimcover@2x': string;
  };
}
