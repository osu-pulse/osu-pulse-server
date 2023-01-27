import { Inject, Injectable } from '@nestjs/common';
import { GRAPHQL_PUB_SUB } from '../../shared/constants/injections';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionService } from '../../shared/helpers/subscription-service';
import { DeviceModel } from '../models/device.model';

@Injectable()
export class DevicesSubscriptionService extends SubscriptionService<{
  (trigger: 'deviceStatusUpdated', payload: DeviceModel): void;
}> {
  constructor(@Inject(GRAPHQL_PUB_SUB) pubSub: PubSub) {
    super(pubSub);
  }
}
