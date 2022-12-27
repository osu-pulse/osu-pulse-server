import * as crypto from 'crypto';

export const randomGenerator = {
  bucketObject: () => crypto.randomBytes(30).toString('hex'),
  userPassword: () => crypto.randomBytes(5).toString('hex'),
  cameraToken: () => crypto.randomBytes(50).toString('hex'),
  accessToken: () => crypto.randomBytes(50).toString('hex'),
};
