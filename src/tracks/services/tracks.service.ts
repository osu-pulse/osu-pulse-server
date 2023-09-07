import { Injectable } from '@nestjs/common';
import { OsuBeatmapsService } from '../../osu/services/osu-beatmaps.service';
import { trackConvertor } from '../convertors/track.convertor';
import { WithCursor } from '../../shared/types/with-cursor';
import { Track } from '../types/track';

@Injectable()
export class TracksService {
  constructor(private osuBeatmapsService: OsuBeatmapsService) {}

  async existsById(trackId: string): Promise<boolean> {
    return this.osuBeatmapsService.existsBeatmapById(trackId);
  }

  async getAllBySearch(
    search?: string,
    cursor?: string,
  ): Promise<WithCursor<Track>> {
    const response = await this.osuBeatmapsService.searchBeatmapSets(
      search,
      cursor,
    );
    const tracks = response.data.map(trackConvertor.fromOsuBeatmapSet);
    return {
      data: tracks,
      cursor: response.cursor,
    };
  }

  async getAllByIds(trackIds: string[]): Promise<Track[]> {
    const beatmaps = await this.osuBeatmapsService.getBeatmapsByIds(trackIds);
    return beatmaps.map(trackConvertor.fromOsuBeatmap);
  }

  async getById(trackId: string): Promise<Track> {
    const beatmap = await this.osuBeatmapsService.getBeatmapById(trackId);
    return trackConvertor.fromOsuBeatmap(beatmap);
  }
}
