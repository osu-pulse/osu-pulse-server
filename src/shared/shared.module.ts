import { Global, Module } from '@nestjs/common';
import { GRAPHQL_PUB_SUB } from './constants/injections';
import { PubSub } from 'graphql-subscriptions';
import { CacheManagerService } from './services/cache-manager.service';

@Global()
@Module({
  providers: [
    { provide: GRAPHQL_PUB_SUB, useClass: PubSub },
    CacheManagerService,
  ],
  exports: [GRAPHQL_PUB_SUB, CacheManagerService],
})
export class SharedModule {}
