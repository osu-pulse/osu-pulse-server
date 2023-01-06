import { randomGenerator } from '../../../src/shared/helpers/random-generator';

describe('randomGenerator', () => {
  describe('refreshToken', () => {
    it('should return refresh token', () => {
      const result = randomGenerator.refreshToken();

      expect(typeof result).toBe('string');
      expect(result).toHaveLength(100);
    });
  });
});
