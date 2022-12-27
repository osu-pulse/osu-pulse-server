import { map } from './object.helper';

export function lowercaseKeys<O extends Record<string, any>>(
  obj: O,
): Record<string, O[keyof O]> {
  return map(obj, (k, v) => [(k as string).toLowerCase(), v]);
}
