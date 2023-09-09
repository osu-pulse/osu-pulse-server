import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';
import { GRAPHQL_PUB_SUB } from '../constants/injections';

export abstract class SubscriptionService<
  E extends (trigger: any, payload: any) => void,
> {
  constructor(@Inject(GRAPHQL_PUB_SUB) private pubSub: PubSub) {}

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
