import { keys, map, omit, pick } from '../../../src/shared/helpers/object';

describe('omit', () => {
  it('removes fields', () => {
    const omitted = omit({ a: 1, b: 2, c: 3 }, ['a', 'b']);

    expect(omitted).toStrictEqual({ c: 3 });
  });
});

describe('pick', () => {
  it('selects fields', () => {
    const picked = pick({ a: 1, b: 2, c: 3 }, ['a', 'b']);

    expect(picked).toStrictEqual({ a: 1, b: 2 });
  });
});

describe('map', () => {
  it('transforms keys and values', () => {
    const mapped = map({ a: 1, b: 2, c: 3 }, (k, v) => [`_${k}`, v * 2]);

    expect(mapped).toStrictEqual({ _a: 2, _b: 4, _c: 6 });
  });
});

describe('keys', () => {
  it('return keys array', () => {
    const arr = keys({ a: 1, b: 2, c: 3 });

    expect(arr).toStrictEqual(['a', 'b', 'c']);
  });
});
