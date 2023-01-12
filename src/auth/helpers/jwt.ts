import jwtDecode, { JwtPayload } from 'jwt-decode';

export function parseJwt(jwt: string): JwtPayload | null {
  try {
    return jwtDecode(jwt);
  } catch {
    return null;
  }
}
