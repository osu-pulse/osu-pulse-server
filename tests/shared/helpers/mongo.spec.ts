import { searchFilter } from 'src/shared/helpers/mongo';

interface Model {
  firstName: string;
  lastName: string;
}

describe('searchFilter', () => {
  it('should return filter when search is defined', () => {
    const result = searchFilter<Model>('search', ['firstName', 'lastName']);

    expect(result).toStrictEqual({
      $or: [
        { firstName: { $regex: /.*search.*/i } },
        { lastName: { $regex: /.*search.*/i } },
      ],
    });
  });

  it('should return undefined when search string is not defined', () => {
    const result = searchFilter<Model>(undefined, ['firstName', 'lastName']);

    expect(result).toBeUndefined();
  });
});
