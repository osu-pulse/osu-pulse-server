import { UserModel } from '../models/user.model';
import { OsuUser } from '../../osu/types/osu-user';
import { osuAssetsUrl, osuUrl } from '../../osu/constants/api-url';

export const userModelConvertor = {
  fromOsuUser(user: OsuUser): UserModel {
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
