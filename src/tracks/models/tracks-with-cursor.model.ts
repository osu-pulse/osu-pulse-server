import { TrackModel } from './track.model';

export class TracksWithCursorModel {
  data: TrackModel[];
  cursor?: string;
}
