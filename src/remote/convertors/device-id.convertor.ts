export const deviceIdConvertor = {
  fromClientId(value: string): string {
    return btoa(value);
  },
  toClientId(value: string): string {
    return atob(value);
  },
};
