import { TrackMetaModel } from '../models/track-meta.model';

export type CreateTrackMeta = Pick<
  TrackMetaModel,
  'trackId' | 'beatmapSetId' | 'duration'
>;
