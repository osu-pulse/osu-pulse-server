import { randomGenerator } from './random-generator.helper';

describe('randomGenerator', () => {
  describe('bucketObject', () => {
    it('should return bucket object', () => {
      const result = randomGenerator.bucketObject();

      expect(typeof result).toBe('string');
      expect(result).toHaveLength(60);
    });
  });

  describe('userPassword', () => {
    it('should return user password', () => {
      const result = randomGenerator.userPassword();

      expect(typeof result).toBe('string');
      expect(result).toHaveLength(10);
    });
  });

  describe('cameraToken', () => {
    it('should return camera token', () => {
      const result = randomGenerator.cameraToken();

      expect(typeof result).toBe('string');
      expect(result).toHaveLength(100);
    });
  });

  describe('accessToken', () => {
    it('should return access token', () => {
      const result = randomGenerator.accessToken();

      expect(typeof result).toBe('string');
      expect(result).toHaveLength(100);
    });
  });
});
