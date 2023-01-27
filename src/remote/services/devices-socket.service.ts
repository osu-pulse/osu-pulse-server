import { Injectable } from '@nestjs/common';
import { SocketService } from '../../shared/helpers/socket-service';
import { DeviceStatusModel } from '../models/device-status.model';

@Injectable()
export class DevicesSocketService extends SocketService<{
  (trigger: 'SET_DEVICE_STATUS', payload: DeviceStatusModel): void;
}> {
  constructor() {
    super();
  }
}
