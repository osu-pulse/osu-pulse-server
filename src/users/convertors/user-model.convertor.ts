import { UserModel } from '../models/user.model';
import { osuUrl } from '../../osu/constants/osu-url';
import { OsuUser } from '../../osu/types/osu-user';

export const userModelConvertor = {
  fromOsuUserModel(user: OsuUser): UserModel {
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
