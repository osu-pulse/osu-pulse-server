export const cursorConvertor = {
  fromString(value: string): string {
    return btoa(value);
  },
  toString(value: string): string {
    return atob(value);
  },
};
