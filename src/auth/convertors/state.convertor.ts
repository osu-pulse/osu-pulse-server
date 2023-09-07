import crypto from 'crypto';

export const stateConvertor = {
  toExternal(state: string | undefined): string {
    return crypto.randomUUID() + (state ?? '');
  },

  fromExternal(state: string): string | undefined {
    const result = state.slice(36);
    return result.length ? result : undefined;
  },
};
