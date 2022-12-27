import { Global, Module } from '@nestjs/common';
import { SubscriptionsService } from './services/subscriptions.service';
import { GRAPHQL_PUB_SUB } from './constants/graphql-pub-sub';
import { PubSub } from 'graphql-subscriptions';

@Global()
@Module({
  providers: [
    SubscriptionsService,
    { provide: GRAPHQL_PUB_SUB, useClass: PubSub },
  ],
  exports: [SubscriptionsService, GRAPHQL_PUB_SUB],
})
export class SharedModule {}
