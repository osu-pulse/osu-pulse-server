import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MaybePromise } from '../types/maybe-promise';

@Injectable()
export class CacheManagerService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  private parseKey<I = unknown>(prefix: string, id: I): string {
    return `${prefix}${id}`;
  }

  async has<I = unknown>(prefix: string, id: I): Promise<boolean> {
    return (await this.get(prefix, id)) === undefined;
  }

  async hasAll<I = unknown>(prefix: string, ids: I[]): Promise<boolean[]> {
    return Promise.all(ids.map((id) => this.has<I>(prefix, id)));
  }

  async get<V = unknown, I = unknown>(
    prefix: string,
    id: I,
  ): Promise<V | undefined> {
    return this.cacheManager.get<V>(this.parseKey(prefix, id));
  }

  async getAll<V = unknown, I = unknown>(
    prefix: string,
    ids: I[],
  ): Promise<(V | undefined)[]> {
    return Promise.all(ids.map((id) => this.get<V>(prefix, id)));
  }

  async merge<
    V = unknown,
    I = unknown,
    F extends undefined | ((id: I) => MaybePromise<V>) = undefined,
  >(
    prefix: string,
    id: I,
    fallback?: F,
  ): Promise<F extends undefined ? V | undefined : V> {
    const value = await this.get<V>(prefix, id);
    if (value !== undefined || fallback === undefined) {
      return value;
    }

    const result = await fallback(id);
    await this.set(prefix, id, result);

    return result;
  }

  async mergeAll<
    V = unknown,
    I = unknown,
    F extends undefined | ((ids: I[]) => MaybePromise<V[]>) = undefined,
  >(
    prefix: string,
    ids: I[],
    fallback?: F,
  ): Promise<F extends undefined ? (V | undefined)[] : V[]> {
    const values = await Promise.all(ids.map((id) => this.get<V>(prefix, id)));
    if (fallback === undefined) {
      return values;
    }

    const misses = values
      .map((value, index) => (value === undefined ? ids[index] : undefined))
      .filter((id) => id !== undefined);

    const results = await fallback(misses);
    await Promise.all(
      misses.map((id, index) => this.set(prefix, id, results[index])),
    );

    const map = Object.fromEntries(
      misses.map((id, index) => [id, results[index]]),
    );

    return ids.map((id, index) => values[index] ?? map[id]);
  }

  async pop<V = unknown, I = unknown>(
    prefix: string,
    id: I,
  ): Promise<V | undefined> {
    const value = await this.get<V, I>(prefix, id);
    if (value !== undefined) {
      await this.cacheManager.del(this.parseKey(prefix, id));
    }
    return value;
  }

  async popAll<V = unknown, I = unknown>(
    prefix: string,
    ids: I[],
  ): Promise<(V | undefined)[]> {
    return Promise.all(ids.map((id) => this.pop<V, I>(prefix, id)));
  }

  async set<V = unknown, I = unknown>(
    prefix: string,
    id: I,
    value: V,
  ): Promise<void> {
    await this.cacheManager.set(this.parseKey(prefix, id), value);
  }

  async setAll<V = unknown, I = unknown>(
    prefix: string,
    ids: I[],
    values: V[],
  ): Promise<void> {
    await Promise.all(
      ids.map((id, index) => this.set<V, I>(prefix, id, values[index])),
    );
  }

  async del<I = unknown>(prefix: string, id: I): Promise<void> {
    await this.cacheManager.del(this.parseKey(prefix, id));
  }

  async delAll<I = unknown>(prefix: string, ids: I[]): Promise<void> {
    await Promise.all(ids.map((id) => this.del<I>(prefix, id)));
  }
}
