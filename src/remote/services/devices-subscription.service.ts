import { Injectable } from '@nestjs/common';
import { SubscriptionService } from '../../shared/services/subscription.service';
import { DeviceModel } from '../models/device.model';

@Injectable()
export class DevicesSubscriptionService extends SubscriptionService<{
  (trigger: 'deviceStatusUpdated', payload: DeviceModel): void;
}> {}
