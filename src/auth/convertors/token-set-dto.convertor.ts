import { TokenSetDto } from '../dto/token-set.dto';
import { OsuTokenSetModel } from '../../osu/models/osu-token-set.model';
import { pick } from '../../shared/helpers/object';

export const tokenSetDtoConvertor = {
  fromOsuTokenSetModel(tokenSet: OsuTokenSetModel): TokenSetDto {
    return pick(tokenSet, ['access_token', 'refresh_token']);
  },
};
