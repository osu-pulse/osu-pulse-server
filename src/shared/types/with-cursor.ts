import { TrackModel } from '../../playlists/models/track.model';

export class WithCursor<T> {
  data: T[];
  cursor?: string;
}
