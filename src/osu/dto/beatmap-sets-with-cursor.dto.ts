import { BeatmapSetDto } from './beatmap-set.dto';

export interface BeatmapSetsWithCursorDto {
  beatmapsets: BeatmapSetDto[];
  cursor_string: string;
}
