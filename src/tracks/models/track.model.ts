import { CoverModel } from './cover.model';

export class TrackModel {
  id: number;
  title: string;
  artist: string;
  cover: CoverModel;
  url: string;
}
