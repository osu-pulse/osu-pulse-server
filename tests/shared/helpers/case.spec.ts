import { lowercaseKeys } from '../../../src/shared/helpers/case';

describe('lowercaseKeys', () => {
  it('should transform object keys to lowercase (not nested)', () => {
    const obj = { AA: 1 };

    const res = lowercaseKeys(obj);

    expect(res).toStrictEqual({ aa: 1 });
  });
});
