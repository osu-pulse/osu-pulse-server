import crypto from 'crypto';

export enum SecretLength {}

export function generateSecret(length: SecretLength | number): string {
  return crypto.randomBytes(length).toString('base64');
}
