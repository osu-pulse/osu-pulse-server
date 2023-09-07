import { Inject, Injectable } from '@nestjs/common';
import { AxiosError, AxiosInstance } from 'axios';
import { AXIOS_OSU_API } from '../constants/injections';
import { OsuException } from '../exceptions/osu.exception';
import { splitChunks } from '../../shared/helpers/array';
import { OsuBeatmapSetsWithCursor } from '../types/osu-beatmap-sets-with-cursor';
import { OsuBeatmapSet } from '../types/osu-beatmap-set';
import { OsuBeatmap } from '../types/osu-beatmap';
import { OsuAuthService } from './osu-auth.service';

@Injectable()
export class OsuBeatmapsService {
  constructor(
    private osuAuthService: OsuAuthService,
    @Inject(AXIOS_OSU_API)
    private axiosOsuApi: AxiosInstance,
  ) {}

  async existsBeatmapById(beatmapId: string): Promise<boolean> {
    try {
      const token = this.osuAuthService.getToken();
      await this.axiosOsuApi.head(`beatmaps/${beatmapId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const token = this.osuAuthService.getToken();
      const { data } = await this.axiosOsuApi.get<{
        beatmapsets: OsuBeatmapSet[];
        cursor_string?: string;
      }>('beatmapsets/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: { q: search, nsfw: '', s: 'any', cursor_string: cursor },
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
    const token = this.osuAuthService.getToken();
    try {
      const { data } = await this.axiosOsuApi.get<OsuBeatmap>(
        `beatmaps/${beatmapId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return data;
    } catch (e) {
      const { message } = e as AxiosError;
      throw new OsuException(message);
    }
  }

  async getBeatmapsByIds(beatmapIds: string[]): Promise<OsuBeatmap[]> {
    try {
      const token = this.osuAuthService.getToken();
      const chunks = await Promise.all(
        splitChunks(beatmapIds, 50).map((ids) =>
          this.axiosOsuApi.get<{
            beatmaps: OsuBeatmap[];
          }>(`beatmaps`, {
            headers: { Authorization: `Bearer ${token}` },
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
