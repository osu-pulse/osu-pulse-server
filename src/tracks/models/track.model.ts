import { TrackCoverModel } from './track-cover.model';
import { TrackUrlModel } from './track-url.model';

export class TrackModel {
  id: string;
  title: string;
  artist: string;
  cover: TrackCoverModel;
  url: TrackUrlModel;
}
