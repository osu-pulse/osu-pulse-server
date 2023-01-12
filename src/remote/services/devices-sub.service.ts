import { Inject, Injectable } from '@nestjs/common';
import { GRAPHQL_PUB_SUB } from '../../shared/constants/injections';
import { PubSub } from 'graphql-subscriptions';
import { SubService } from '../../shared/helpers/sub-service';
import { DeviceModel } from '../models/device.model';

@Injectable()
export class DevicesSubService extends SubService<{
  (trigger: 'deviceStatusUpdated', payload: DeviceModel): void;
}> {
  constructor(@Inject(GRAPHQL_PUB_SUB) pubSub: PubSub) {
    super(pubSub);
  }
}
