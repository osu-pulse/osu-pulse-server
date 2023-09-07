import { DataLoaderFn, DataLoadersContext } from '../types/data-loader';
import DataLoader from 'dataloader';

export function createLoader<
  C extends DataLoadersContext<any>,
  K extends keyof C['loaders'],
>(
  context: C,
  name: K,
  fn: DataLoaderFn<
    Parameters<C['loaders'][K]['load']>[0],
    Awaited<ReturnType<C['loaders'][K]['load']>>
  >,
): C['loaders'][K] {
  if (!context.loaders[name]) {
    context.loaders[name] = new DataLoader(fn as any) as any;
  }

  return context.loaders[name];
}
