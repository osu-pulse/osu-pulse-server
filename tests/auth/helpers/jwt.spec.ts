import { parseJwt } from '../../../src/auth/helpers/jwt';

describe('parseJwt', () => {
  it('should return jwt payload', () => {
    const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    const payload = parseJwt(jwt);

    expect(payload).toStrictEqual({
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022,
    });
  });

  it('should return false if jwt is invalid', () => {
    const jwt = '123';

    const payload = parseJwt(jwt);

    expect(payload).toBeFalsy();
  });
});
