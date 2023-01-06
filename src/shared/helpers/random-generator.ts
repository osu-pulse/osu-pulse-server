import * as crypto from 'crypto';

export const randomGenerator = {
  refreshToken: () => crypto.randomBytes(100).toString('hex'),
};
