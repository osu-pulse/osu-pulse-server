import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { AXIOS_KITSU } from '../constants/injections';

@Injectable()
export class KitsuService {
  constructor(
    @Inject(AXIOS_KITSU)
    private axiosKitsu: AxiosInstance,
  ) {}

  async getFile(beatmapSetId: string): Promise<Buffer> {
    const response = await this.axiosKitsu.get<ArrayBuffer>(
      `audio/${beatmapSetId}`,
      { responseType: 'arraybuffer' },
    );
    return Buffer.from(response.data);
  }
}
