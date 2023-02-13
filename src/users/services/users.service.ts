import { Injectable } from '@nestjs/common';
import { userModelConvertor } from '../convertors/user-model.convertor';
import { UserModel } from '../models/user.model';
import { OsuUsersService } from '../../osu/services/osu-users.service';

@Injectable()
export class UsersService {
  constructor(private osuUsersService: OsuUsersService) {}

  async getMe(userId: string): Promise<UserModel> {
    const user = await this.osuUsersService.getMe(userId);
    return userModelConvertor.fromOsuUserModel(user);
  }
}
