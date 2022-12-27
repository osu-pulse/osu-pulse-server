import { SubscriptionsService } from './subscriptions.service';
import { Test } from '@nestjs/testing';
import { PubSubAsyncIterator } from 'graphql-subscriptions/dist/pubsub-async-iterator';
import { PubSub } from 'graphql-subscriptions';
import { GRAPHQL_PUB_SUB } from '../constants/graphql-pub-sub';

describe('SystemResolver', () => {
  let pubSub: PubSub;
  let subscriptionService: SubscriptionsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        { provide: GRAPHQL_PUB_SUB, useClass: PubSub },
        SubscriptionsService,
      ],
    }).compile();

    pubSub = moduleRef.get(GRAPHQL_PUB_SUB);
    subscriptionService = moduleRef.get(SubscriptionsService);
  });

  it('should be created', () => {
    expect(subscriptionService).toBeDefined();
  });

  describe('send', () => {
    it('should return undefined promise', async () => {
      const publishSpy = jest.spyOn(pubSub, 'publish');

      const result = await subscriptionService.send('sampleCreated', {
        id: 'id',
      });

      expect(publishSpy).toBeCalledWith('sampleCreated', {
        sampleCreated: { id: 'id' },
      });
      expect(result).toBeUndefined();
    });
  });

  describe('wait', () => {
    it('should return async iterator', () => {
      const asyncIteratorSpy = jest.spyOn(pubSub, 'asyncIterator');

      const result = subscriptionService.wait('sampleCreated');

      expect(asyncIteratorSpy).toBeCalledWith('sampleCreated');
      expect(result).toBeInstanceOf(PubSubAsyncIterator);
    });
  });
});
