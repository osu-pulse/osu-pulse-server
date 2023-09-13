import { Injectable } from '@nestjs/common';
import { PubSubService } from '../../shared/services/pub-sub.service';
import { Device } from '../types/device';

@Injectable()
export class DevicesPubSubService extends PubSubService<
  | ((trigger: 'deviceConnected', payload: Device) => void)
  | ((trigger: 'deviceDisconnected', payload: Device) => void)
> {}
