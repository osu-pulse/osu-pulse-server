import { OsuBeatmap } from './osu-beatmap';

export interface OsuBeatmapSet {
  id: number;
  title: string;
  artist: string;
  beatmaps: Omit<OsuBeatmap, 'beatmapset'>[];
  favourite_count: number;
  play_count: number;
  covers: {
    list: string;
    'list@2x': string;
  };
}
