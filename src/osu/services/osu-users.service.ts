import { Inject, Injectable } from '@nestjs/common';
import { AxiosError, AxiosInstance } from 'axios';
import { AXIOS_OSU_API } from '../constants/injections';
import { OsuException } from '../exceptions/osu.exception';
import { OsuAuthService } from './osu-auth.service';
import { AccessTokenHolderService } from '../../auth/services/access-token-holder.service';
import { OsuUserModel } from '../models/osu-user.model';

@Injectable()
export class OsuUsersService {
  constructor(
    private osuAuthService: OsuAuthService,
    private accessTokenHolderService: AccessTokenHolderService,
    @Inject(AXIOS_OSU_API)
    private axiosOsuApi: AxiosInstance,
  ) {}

  async getMe(userId: string): Promise<OsuUserModel> {
    try {
      const token = this.accessTokenHolderService.get(userId);
      const { data } = await this.axiosOsuApi.get<OsuUserModel>('me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (e) {
      const { message } = e as AxiosError;
      throw new OsuException(message);
    }
  }
}
