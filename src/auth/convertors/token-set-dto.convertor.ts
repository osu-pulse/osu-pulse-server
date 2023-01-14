import { TokenSetModel } from '../models/token-set.model';
import { TokenSetDto } from '../dto/token-set.dto';
import { OsuTokenSet } from '../../osu/types/osu-token-set';
import { pick } from '../../shared/helpers/object';

export const tokenSetDtoConvertor = {
  fromTokenSetModel(model: TokenSetModel): TokenSetDto {
    return {
      access_token: model.accessToken,
      refresh_token: model.refreshToken,
    };
  },

  fromOsuTokenSet(tokenSet: OsuTokenSet): TokenSetDto {
    return pick(tokenSet, ['access_token', 'refresh_token']);
  },
};
