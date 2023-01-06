import * as crypto from 'crypto';

export const randomGenerator = {
  refreshToken: () => crypto.randomBytes(50).toString('hex'),
};
