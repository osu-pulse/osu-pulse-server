import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { AXIOS_KITSU } from '../constants/injections';
import { CacheCanceledException } from '../../tracks/exceptions/cache-canceled.exception';
import { KitsuException } from '../../tracks/exceptions/kitsu.exception';

@Injectable()
export class KitsuService {
  private controllers: Map<string, AbortController>;

  constructor(
    @Inject(AXIOS_KITSU)
    private axiosKitsu: AxiosInstance,
  ) {
    this.controllers = new Map();
  }

  async getFile(beatmapSetId: string): Promise<Buffer> {
    try {
      const controller = new AbortController();
      this.controllers.set(beatmapSetId, controller);
      const response = await this.axiosKitsu.get<ArrayBuffer>(
        `audio/${beatmapSetId}`,
        { responseType: 'arraybuffer', signal: controller.signal },
      );
      this.controllers.delete(beatmapSetId);
      return Buffer.from(response.data);
    } catch (e) {
      if (axios.isCancel(e)) {
        throw new CacheCanceledException();
      } else {
        const { message } = e as AxiosError;
        throw new KitsuException(message);
      }
    }
  }

  cancelGetFile(beatmapSetId: string): void {
    this.controllers.get(beatmapSetId)?.abort();
  }
}
