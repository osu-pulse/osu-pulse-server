import { PubSub } from 'graphql-subscriptions';

export abstract class SubService<
  E extends (trigger: any, payload: any) => void,
> {
  protected constructor(private pubSub: PubSub) {}

  async publish(
    trigger: Parameters<E>[0],
    payload: Parameters<E>[1],
  ): Promise<void> {
    await this.pubSub.publish(trigger, { [trigger]: payload });
  }

  iterator(trigger: Parameters<E>[0]): AsyncIterator<Parameters<E>[0]> {
    return this.pubSub.asyncIterator(trigger);
  }
}
