import { TrackModel } from '../models/track.model';

export class WithCursor<T> {
  data: T[];
  cursor?: string;
}
