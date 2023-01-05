import { Global, Module } from '@nestjs/common';
import { GRAPHQL_PUB_SUB } from './constants/injections';
import { PubSub } from 'graphql-subscriptions';

@Global()
@Module({
  providers: [{ provide: GRAPHQL_PUB_SUB, useClass: PubSub }],
  exports: [GRAPHQL_PUB_SUB],
})
export class SharedModule {}
