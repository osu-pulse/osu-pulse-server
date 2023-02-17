import { UserModel } from '../models/user.model';
import { osuUrl } from '../../osu/constants/api-url';
import { OsuUserModel } from '../../osu/models/osu-user.model';

export const userModelConvertor = {
  fromOsuUserModel(user: OsuUserModel): UserModel {
    return {
      id: String(user.id),
      username: user.username,
      url: {
        profile: `${osuUrl}/users/${user.id}`,
        cover: user.cover_url,
        avatar: user.avatar_url,
      },
    };
  },
};
