import { Injectable } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { userAgentConvertor } from '../convertors/user-agent.convertor';
import { Device } from '../types/device';
import crypto from 'crypto';
import { DevicesPubSubService } from './devices-pub-sub.service';

@Injectable()
export class ConnectorService {
  constructor(
    private devicesService: DevicesService,
    private devicesPubSubService: DevicesPubSubService,
  ) {}

  async connect(userId: string, userAgent: string): Promise<Device> {
    const device = this.devicesService.create({
      ...userAgentConvertor.toDeviceInfo(userAgent),
      id: crypto.randomUUID(),
      userId,
    });

    await this.devicesPubSubService.publish('deviceConnected', device);

    return device;
  }

  async disconnect(deviceId: string): Promise<void> {
    const device = this.devicesService.remove(deviceId);

    await this.devicesPubSubService.publish('deviceDisconnected', device);
  }
}
