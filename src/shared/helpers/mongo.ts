import { connection, FilterQuery, RootQuerySelector } from 'mongoose';
import { MaybePromise } from '../types/maybe-promise';

export async function withTransaction<T>(
  action: () => MaybePromise<T>,
): Promise<T> {
  const session = await connection.startSession();

  session.startTransaction();
  let result;
  try {
    result = await action();
    await session.commitTransaction();
    return result;
  } catch (e) {
    await session.abortTransaction();
    throw e;
  } finally {
    await session.endSession();
  }
}

export function searchFilter<M extends Record<string, any>>(
  search: string | undefined,
  fields: (keyof M)[],
): RootQuerySelector<M> | undefined {
  return search !== '' && search != null
    ? {
        $or: fields.map(
          (field) =>
            ({
              [field]: { $regex: new RegExp(`.*${search}.*`, 'i') },
            }) as FilterQuery<keyof M>,
        ),
      }
    : undefined;
}
