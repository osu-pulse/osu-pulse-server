import { DataLoadersContext } from '../types/data-loaders-context';
import DataLoader from 'dataloader';

export function initDataLoader<
  C extends DataLoadersContext<any>,
  K extends keyof C,
>(
  context: C,
  name: K,
  fn: (key: Parameters<C[K]['load']>[0][]) => ReturnType<C[K]['loadMany']>,
): C[K] {
  if (!context[name]) {
    context[name] = new DataLoader(fn as any) as any;
  }

  return context[name];
}
