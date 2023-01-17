import { Connection } from 'mongoose';
import { MaybePromise } from '../types/maybe-promise';

export async function withTransaction<T>(
  connection: Connection,
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
