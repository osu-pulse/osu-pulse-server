import { Injectable } from '@nestjs/common';
import { OsuBeatmapsService } from '../../osu/services/osu-beatmaps.service';
import { trackModelConvertor } from '../convertors/track-model.convertor';
import { WithCursor } from '../../shared/types/with-cursor';
import { TrackModel } from '../models/track.model';
import { BucketService } from '../../bucket/services/bucket.service';
import { KitsuService } from '../../osu/services/kitsu.service';
import { BucketName } from '../../bucket/constants/bucket-name';
import { AudioFileType } from '../../bucket/constants/file-type';

@Injectable()
export class TracksService {
  constructor(
    private osuBeatmapsService: OsuBeatmapsService,
    private kitsuService: KitsuService,
    private bucketService: BucketService,
  ) {}

  async existsById(trackId: string): Promise<boolean> {
    return this.osuBeatmapsService.existsBeatmapById(trackId);
  }

  async getAllBySearch(
    search?: string,
    cursor?: string,
  ): Promise<WithCursor<TrackModel>> {
    const response = await this.osuBeatmapsService.getAllBeatmapSets(
      search,
      cursor,
    );
    const tracks = response.data.map(trackModelConvertor.fromOsuBeatmapSet);
    return {
      data: tracks,
      cursor: response.cursor,
    };
  }

  async getAllByIds(trackIds: string[]): Promise<TrackModel[]> {
    const beatmaps = await this.osuBeatmapsService.getBeatmapsByIds(trackIds);
    return beatmaps.map(trackModelConvertor.fromOsuBeatmap);
  }

  async getById(trackId: string): Promise<TrackModel> {
    const beatmap = await this.osuBeatmapsService.getBeatmapById(trackId);
    return trackModelConvertor.fromOsuBeatmap(beatmap);
  }

  async isCached(trackId: string): Promise<boolean> {
    return this.bucketService.exists(BucketName.TRACK_CACHES, trackId);
  }

  async cache(trackId: string): Promise<void> {
    const track = await this.getById(trackId);
    const file = await this.kitsuService.getFile(track.beatmapSetId);
    await this.bucketService.create(
      BucketName.TRACK_CACHES,
      track.id,
      file,
      AudioFileType.MP3,
    );
  }
}
