import { Injectable } from '@nestjs/common';
import { DeviceModel } from '../models/device.model';
import { DeviceInfoModel } from '../models/device-info.model';
import { DeviceStatusModel } from '../models/device-status.model';
import { DevicesSubService } from './devices-sub.service';

type UserId = string;
type DeviceId = string;

@Injectable()
export class DevicesService {
  private users: Map<DeviceId, UserId>;
  private devices: Map<UserId, Map<DeviceId, DeviceModel>>;

  constructor(private devicesSubService: DevicesSubService) {
    this.users = new Map();
    this.devices = new Map();
  }

  existsByUserIdAndDeviceId(userId: string, deviceId: string): boolean {
    return this.users.get(deviceId) === userId;
  }

  getAllByUserId(userId: string): DeviceModel[] {
    return Array.from(this.devices.get(userId).values());
  }

  getDeviceById(deviceId: string): DeviceModel {
    const userId = this.users.get(deviceId);
    return this.devices.get(userId).get(deviceId);
  }

  async updateStatus(
    deviceId: string,
    status: DeviceStatusModel,
  ): Promise<DeviceModel> {
    const userId = this.users.get(deviceId);
    const device = this.devices.get(userId).get(deviceId);
    const updatedDevice: DeviceModel = { ...device, status };
    this.devices.get(userId).set(deviceId, updatedDevice);

    await this.devicesSubService.publish('deviceStatusUpdated', updatedDevice);

    return updatedDevice;
  }

  add(userId: string, deviceId: string, info: DeviceInfoModel): void {
    this.users.set(deviceId, userId);

    const device: DeviceModel = {
      deviceId,
      userId,
      info,
      status: {},
    };

    if (this.devices.has(userId)) {
      this.devices.get(userId).set(deviceId, device);
    } else {
      this.devices.set(userId, new Map([[deviceId, device]]));
    }
  }

  remove(deviceId: string): void {
    const userId = this.users.get(deviceId);

    this.devices.get(userId).delete(deviceId);
    this.users.delete(deviceId);
  }
}
