export interface BeatmapSetDto {
  id: number;
  title: string;
  artist: string;
  covers: {
    list: string;
    'list@2x': string;
  };
}
