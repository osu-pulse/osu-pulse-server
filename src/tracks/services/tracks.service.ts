import { Injectable } from '@nestjs/common';
import { OsuBeatmapsService } from '../../osu/services/osu-beatmaps.service';
import { trackConvertor } from '../convertors/track.convertor';
import { Track } from '../types/track';
import { OsuDirectBeatmapsService } from '../../osu/services/osu-direct-beatmaps.service';
import { TrackUrl } from '../types/track-url';
import { osuUrl } from '../../osu/constants/osu-url';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../core/helpers/env';
import { TrackCover } from '../types/track-cover';
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

  getUrl(track: Track): TrackUrl {
    return {
      audio: `${osuUrl.direct}/media/audio/${track.beatmapId}`,
      page: `${osuUrl.base}/beatmapsets/${track.beatmapSetId}`,
      map: `${osuUrl.direct}/d/${track.beatmapSetId}`,
    };
  }

  getCover(track: Track): TrackCover {
    const proxyUrl = this.configService.get('URL_PROXY');
    const coversUrl = `${proxyUrl}/assets.ppy.sh/beatmaps/${track.beatmapSetId}/covers`;

    return {
      list: `${coversUrl}/list.jpg`,
      list2x: `${coversUrl}/list@2x.jpg`,
      wide: `${coversUrl}/slimcover.jpg`,
      wide2x: `${coversUrl}/slimcover@2x.jpg`,
    };
  }
}
