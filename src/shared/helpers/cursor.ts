import { cursorConvertor } from '../convertors/cursor.convertor';

export function sliceArrayByCursor(
  array: string[],
  limit: number,
  cursor?: string,
): string[] {
  const cursorValue = cursor && cursorConvertor.toString(cursor);
  const cursorIndex = array.findIndex((id) => id === cursorValue);
  return array.slice(cursorIndex + 1, cursorIndex + 1 + limit);
}
