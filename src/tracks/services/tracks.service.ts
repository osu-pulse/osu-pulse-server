import { Injectable, Logger } from '@nestjs/common';
import { OsuBeatmapsService } from '../../osu/services/osu-beatmaps.service';
import { trackModelConvertor } from '../convertors/track-model.convertor';
import { WithCursor } from '../../shared/types/with-cursor';
import { TrackModel } from '../models/track.model';
import { BucketService } from '../../bucket/services/bucket.service';
import { KitsuService } from '../../osu/services/kitsu.service';
import { BucketName } from '../../bucket/constants/bucket-name';
import { AudioFileType } from '../../bucket/constants/file-type';
import { firstValueFrom, Subject } from 'rxjs';
import { CacheCanceledException } from '../exceptions/cache-canceled.exception';

@Injectable()
export class TracksService {
  private readonly logger = new Logger(TracksService.name);
  private cacheThreads: Map<
    string,
    { subject: Subject<void>; userIds: Set<string> }
  >;

  constructor(
    private osuBeatmapsService: OsuBeatmapsService,
    private kitsuService: KitsuService,
    private bucketService: BucketService,
  ) {
    this.cacheThreads = new Map();
  }

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
    const tracks = response.data.map(
      trackModelConvertor.fromOsuBeatmapSetModel,
    );
    return {
      data: tracks,
      cursor: response.cursor,
    };
  }

  async getAllByIds(trackIds: string[]): Promise<TrackModel[]> {
    const beatmaps = await this.osuBeatmapsService.getBeatmapsByIds(trackIds);
    return beatmaps.map(trackModelConvertor.fromOsuBeatmapModel);
  }

  async getById(trackId: string): Promise<TrackModel> {
    const beatmap = await this.osuBeatmapsService.getBeatmapById(trackId);
    return trackModelConvertor.fromOsuBeatmapModel(beatmap);
  }

  async isCached(trackId: string): Promise<boolean> {
    return this.bucketService.exists(BucketName.TRACK_CACHES, trackId);
  }

  async cache(userId: string, trackId: string): Promise<void> {
    this.logger.verbose(`Track ${trackId} started caching by user ${userId}`);

    if (this.cacheThreads.has(trackId)) {
      const { subject, userIds } = this.cacheThreads.get(trackId);
      userIds.add(userId);
      await firstValueFrom(subject);
    } else {
      this.cacheThreads.set(trackId, {
        subject: new Subject(),
        userIds: new Set([userId]),
      });

      const track = await this.getById(trackId);
      const file = await this.kitsuService.getFile(track.beatmapSetId);
      await this.bucketService.create(
        BucketName.TRACK_CACHES,
        track.id,
        file,
        AudioFileType.MP3,
      );

      const { subject, userIds } = this.cacheThreads.get(trackId);
      userIds.delete(userId);
      subject.next();
      subject.complete();
      this.cacheThreads.delete(trackId);

      this.logger.verbose(
        `Track ${trackId} finished caching by user ${userId}`,
      );
    }
  }

  async cancelCache(userId: string, trackId: string): Promise<void> {
    if (this.cacheThreads.has(trackId)) {
      const { subject, userIds } = this.cacheThreads.get(trackId);
      userIds.delete(userId);

      if (userIds.size == 0) {
        const track = await this.getById(trackId);
        this.kitsuService.cancelGetFile(track.beatmapSetId);
        subject.error(new CacheCanceledException());
        subject.complete();
        this.cacheThreads.delete(trackId);

        this.logger.verbose(`Track ${trackId} caching canceled`);
      }
    }
  }
}
