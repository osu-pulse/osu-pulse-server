import { Injectable, Logger } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DeviceStatusModel } from '../models/device-status.model';

@Injectable()
export class RemoteControlService {
  private readonly logger = new Logger(RemoteControlService.name);

  constructor(private devicesService: DevicesService) {}

  async setDeviceStatus(
    deviceId: string,
    status: DeviceStatusModel,
  ): Promise<void> {
    const client = this.devicesService.getClientByDeviceId(deviceId);
    client.emit('SET_DEVICE_STATUS', status);

    await this.devicesService.updateStatus(deviceId, status);

    this.logger.verbose(
      `For device ${deviceId} was set status: ${JSON.stringify(status)}`,
    );
  }
}
