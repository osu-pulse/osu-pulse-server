import { Inject, Injectable } from '@nestjs/common';
import { AxiosError, AxiosInstance } from 'axios';
import { AXIOS_OSU_API } from '../constants/injections';
import { OsuException } from '../exceptions/osu.exception';
import { AccessTokenHolderService } from '../../auth/services/access-token-holder.service';
import { OsuUser } from '../types/osu-user';

@Injectable()
export class OsuUsersService {
  constructor(
    private accessTokenHolderService: AccessTokenHolderService,
    @Inject(AXIOS_OSU_API)
    private axiosOsuApi: AxiosInstance,
  ) {}

  async getMe(userId: string): Promise<OsuUser> {
    try {
      const token = this.accessTokenHolderService.get(userId);
      const { data } = await this.axiosOsuApi.get<OsuUser>('me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (e) {
      const { message } = e as AxiosError;
      throw new OsuException(message);
    }
  }
}
