import { TokenSetModel } from '../models/token-set.model';
import { TokenSetDto } from '../dto/token-set.dto';
import { OsuTokenSetModel } from '../../osu/models/osu-token-set.model';
import { pick } from '../../shared/helpers/object';

export const tokenSetDtoConvertor = {
  fromTokenSetModel(model: TokenSetModel): TokenSetDto {
    return {
      access_token: model.accessToken,
      refresh_token: model.refreshToken,
    };
  },

  fromOsuTokenSetModel(tokenSet: OsuTokenSetModel): TokenSetDto {
    return pick(tokenSet, ['access_token', 'refresh_token']);
  },
};
