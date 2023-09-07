import DataLoader from 'dataloader';

export interface DataLoadersContext<T extends Record<string, [any, any]>> {
  loaders: Partial<Record<keyof T, DataLoader<T[keyof T][0], T[keyof T][1]>>>;
}

export type DataLoaderFn<K, V> = (keys: K[]) => Promise<V[]>;
