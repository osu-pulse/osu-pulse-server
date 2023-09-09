import { Inject, Injectable } from '@nestjs/common';
import { AxiosError, AxiosInstance } from 'axios';
import { AXIOS_OSU_DIRECT } from '../constants/injections';
import { OsuBeatmapSet } from '../types/osu-beatmap-set';
import { OsuDirectException } from '../exceptions/osu-direct.exception';

@Injectable()
export class OsuDirectBeatmapsService {
  constructor(
    @Inject(AXIOS_OSU_DIRECT)
    private axiosOsuDirect: AxiosInstance,
  ) {}

  async searchBeatmapSets(
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<OsuBeatmapSet[]> {
    try {
      const { data } = await this.axiosOsuDirect.get<OsuBeatmapSet[]>(
        'v2/search',
        {
          params: { query: search, amount: limit, offset },
        },
      );
      return data;
    } catch (e) {
      const { message } = e as AxiosError;
      throw new OsuDirectException(message);
    }
  }
}
