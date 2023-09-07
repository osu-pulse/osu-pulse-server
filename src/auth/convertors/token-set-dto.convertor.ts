import { TokenSetDto } from '../dto/token-set.dto';
import { OsuTokenSet } from '../../osu/types/osu-token-set';
import { pick } from '../../shared/helpers/object';

export const tokenSetDtoConvertor = {
  fromOsuTokenSetModel(tokenSet: OsuTokenSet): TokenSetDto {
    return pick(tokenSet, ['access_token', 'refresh_token']);
  },
};
