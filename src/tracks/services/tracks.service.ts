import { Injectable } from '@nestjs/common';
import { OsuService } from '../../osu/services/osu.service';
import { trackConvertor } from '../convertors/track.convertor';
import { TracksWithCursorModel } from '../models/tracks-with-cursor.model';
import { TrackModel } from '../models/track.model';
import { BucketService } from '../../bucket/services/bucket.service';
import { KitsuService } from '../../osu/services/kitsu.service';
import { BucketName } from '../../bucket/constants/bucket-name';
import { AudioFileType } from '../../bucket/constants/file-type';

@Injectable()
export class TracksService {
  constructor(
    private osuService: OsuService,
    private kitsuService: KitsuService,
    private bucketService: BucketService,
  ) {}

  async getAll(
    search?: string,
    cursor?: string,
  ): Promise<TracksWithCursorModel> {
    const { beatmapsets, cursor_string } = await this.osuService.getBeatmapSets(
      search,
      cursor,
    );
    const tracks = beatmapsets.map(trackConvertor.fromBeatmapSet);
    return {
      cursor: cursor_string,
      tracks,
    };
  }

  async getById(trackId: string): Promise<TrackModel> {
    const beatmapSet = await this.osuService.getBeatmapSetById(trackId);
    return trackConvertor.fromBeatmapSet(beatmapSet);
  }

  async isCached(trackId: string): Promise<boolean> {
    return this.bucketService.exists(BucketName.TRACKS, trackId);
  }

  async cache(trackId: string): Promise<void> {
    const file = await this.kitsuService.getFile(trackId);
    await this.bucketService.create(
      BucketName.TRACKS,
      trackId,
      file,
      AudioFileType.MP3,
    );
  }
}
