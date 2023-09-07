import { Inject, Injectable } from '@nestjs/common';
import { AxiosError, AxiosInstance } from 'axios';
import { AXIOS_OSU_API } from '../constants/injections';
import { OsuException } from '../exceptions/osu.exception';
import { splitChunks } from '../../shared/helpers/array';
import { OsuBeatmapSetsWithCursor } from '../types/osu-beatmap-sets-with-cursor';
import { OsuBeatmapSet } from '../types/osu-beatmap-set';
import { OsuBeatmap } from '../types/osu-beatmap';

@Injectable()
export class OsuBeatmapsService {
  constructor(
    @Inject(AXIOS_OSU_API)
    private axiosOsuApi: AxiosInstance,
  ) {}

  async existsBeatmapById(beatmapId): Promise<boolean> {
    try {
      await this.axiosOsuApi.head(`beatmaps/${beatmapId}`);
      return true;
    } catch (e) {
      const {
        message,
        response: { status },
      } = e as AxiosError;
      if (status == 404) {
        return false;
      } else {
        throw new OsuException(message);
      }
    }
  }

  async searchBeatmapSets(
    search?: string,
    cursor?: string,
  ): Promise<OsuBeatmapSetsWithCursor> {
    try {
      const { data } = await this.axiosOsuApi.get<{
        beatmapsets: OsuBeatmapSet[];
        cursor_string?: string;
      }>('beatmapsets/search', {
        params: { q: search, nsfw: '', cursor_string: cursor },
      });
      return {
        data: data.beatmapsets,
        cursor: data.cursor_string,
      };
    } catch (e) {
      const { message } = e as AxiosError;
      throw new OsuException(message);
    }
  }

  async getBeatmapById(beatmapId: string): Promise<OsuBeatmap> {
    try {
      const { data } = await this.axiosOsuApi.get<OsuBeatmap>(
        `beatmaps/${beatmapId}`,
      );
      return data;
    } catch (e) {
      const { message } = e as AxiosError;
      throw new OsuException(message);
    }
  }

  async getBeatmapsByIds(beatmapIds: string[]): Promise<OsuBeatmap[]> {
    try {
      const chunks = await Promise.all(
        splitChunks(beatmapIds, 50).map((ids) =>
          this.axiosOsuApi.get<{
            beatmaps: OsuBeatmap[];
          }>(`beatmaps`, {
            params: Object.fromEntries(
              ids.map((id, i) => [`ids[${i}]`, Number(id)]),
            ),
          }),
        ),
      );
      const beatmaps = chunks.flatMap(({ data: { beatmaps } }) => beatmaps);

      return beatmapIds
        .map(Number)
        .map((beatmapId) => beatmaps.find(({ id }) => id === beatmapId));
    } catch (e) {
      const { message } = e as AxiosError;
      throw new OsuException(message);
    }
  }
}
