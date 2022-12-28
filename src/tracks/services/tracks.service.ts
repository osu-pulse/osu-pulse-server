import { Injectable } from '@nestjs/common';
import { OsuService } from '../../osu/services/osu.service';
import { trackConvertor } from '../convertors/track.convertor';
import { TracksWithCursorModel } from '../models/tracks-with-cursor.model';
import { TrackModel } from '../models/track.model';

@Injectable()
export class TracksService {
  constructor(private osuService: OsuService) {}

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

  async getById(trackId: number): Promise<TrackModel> {
    const beatmapSet = await this.osuService.getBeatmapSetById(trackId);
    return trackConvertor.fromBeatmapSet(beatmapSet);
  }
}
