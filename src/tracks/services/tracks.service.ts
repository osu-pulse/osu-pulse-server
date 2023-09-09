import { Injectable } from '@nestjs/common';
import { OsuBeatmapsService } from '../../osu/services/osu-beatmaps.service';
import { trackConvertor } from '../convertors/track.convertor';
import { Track } from '../types/track';
import { OsuDirectBeatmapsService } from '../../osu/services/osu-direct-beatmaps.service';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../core/helpers/env';
import { CacheManagerService } from '../../shared/services/cache-manager.service';

@Injectable()
export class TracksService {
  constructor(
    private osuBeatmapsService: OsuBeatmapsService,
    private osuDirectBeatmapsService: OsuDirectBeatmapsService,
    private cacheManagerService: CacheManagerService,
    private configService: ConfigService<Env, true>,
  ) {}

  async existsById(trackId: string): Promise<boolean> {
    const fetch = async (trackId: string) =>
      this.osuBeatmapsService.existsBeatmapById(trackId);

    return this.cacheManagerService.merge('track:exists:', trackId, fetch);
  }

  async getAllBySearch(
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<Track[]> {
    const response = await this.osuDirectBeatmapsService.searchBeatmapSets(
      search,
      limit,
      offset,
    );
    return response.map(trackConvertor.fromOsuBeatmapSet);
  }

  async getAllByIds(trackIds: string[]): Promise<Track[]> {
    const fetch = async (trackIds: string[]) => {
      const beatmaps = await this.osuBeatmapsService.getBeatmapsByIds(trackIds);
      return beatmaps.map(trackConvertor.fromOsuBeatmap);
    };

    return this.cacheManagerService.mergeAll('track:get:', trackIds, fetch);
  }

  async getById(trackId: string): Promise<Track> {
    const fetch = async (trackId: string) => {
      const beatmap = await this.osuBeatmapsService.getBeatmapById(trackId);
      return trackConvertor.fromOsuBeatmap(beatmap);
    };

    return this.cacheManagerService.merge('track:get:', trackId, fetch);
  }
}
