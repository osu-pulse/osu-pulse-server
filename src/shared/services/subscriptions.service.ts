import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { GRAPHQL_PUB_SUB } from '../constants/graphql-pub-sub';

@Injectable()
export class SubscriptionsService {
  constructor(@Inject(GRAPHQL_PUB_SUB) private pubSub: PubSub) {}

  send<T>(name: string, payload: T): Promise<void> {
    return this.pubSub.publish(name, { [name]: payload });
  }

  wait<T>(name: string): AsyncIterator<T> {
    return this.pubSub.asyncIterator<T>(name);
  }
}
