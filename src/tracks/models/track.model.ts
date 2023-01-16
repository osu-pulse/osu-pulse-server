import { TrackCoverModel } from './track-cover.model';

export class TrackModel {
  id: string;
  beatmapId: string;
  beatmapSetId: string;
  title: string;
  artist: string;
  played: number;
  liked: number;
  cover: TrackCoverModel;
}
