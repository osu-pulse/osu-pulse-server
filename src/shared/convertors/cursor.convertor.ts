export const cursorConvertor = {
  fromString(value: string): string {
    return btoa(value);
  },
  toString(cursor: string): string {
    return atob(cursor);
  },
};
