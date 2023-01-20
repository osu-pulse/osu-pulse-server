import { TokenSet } from '../../../src/auth/types/token-set';
import { tokenSetDtoConvertor } from '../../../src/auth/convertors/token-set-dto.convertor';
import { OsuTokenSet } from '../../../src/osu/types/osu-token-set';

describe('tokenSetDtoConvertor', () => {
  describe('fromTokenSetModel', () => {
    it('should transform token set model to token set dto', () => {
      const tokenSetModel: TokenSet = {
        accessToken: 'access',
        refreshToken: 'refresh',
      };

      const tokenSetDto = tokenSetDtoConvertor.fromTokenSet(tokenSetModel);

      expect(tokenSetDto).toStrictEqual({
        access_token: 'access',
        refresh_token: 'refresh',
      });
    });
  });

  describe('fromOsuTokenSet', () => {
    it('should transform osu token set to token set dto', () => {
      const osuTokenSet: OsuTokenSet = {
        access_token: 'access',
        refresh_token: 'refresh',
        token_type: 'Bearer',
        expires_in: 3600,
      };

      const tokenSetDto = tokenSetDtoConvertor.fromOsuTokenSet(osuTokenSet);

      expect(tokenSetDto).toStrictEqual({
        access_token: 'access',
        refresh_token: 'refresh',
      });
    });
  });
});
