import DataLoader from 'dataloader';

export type DataLoadersContext<T extends Record<string, [any, any]>> = Partial<
  Record<keyof T, DataLoader<T[keyof T][0], T[keyof T][1]>>
>;
