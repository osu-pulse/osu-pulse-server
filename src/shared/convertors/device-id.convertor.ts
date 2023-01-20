export const deviceIdConvertor = {
  fromClientId(value: string): string {
    return Buffer.from(value, 'utf-8').toString('hex');
  },
  toClientId(value: string): string {
    return Buffer.from(value, 'hex').toString('utf-8');
  },
};
