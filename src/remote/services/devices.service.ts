import { Injectable } from '@nestjs/common';
import { DeviceModel } from '../models/device.model';
import { DeviceInfoModel } from '../models/device-info.model';
import { DeviceStatusModel } from '../models/device-status.model';
import { DevicesSubscriptionService } from './devices-subscription.service';
import { Socket } from 'socket.io';
import { deviceIdConvertor } from '../convertors/device-id.convertor';
import { DevicesSocketService } from './devices-socket.service';

type UserId = string;
type DeviceId = string;

@Injectable()
export class DevicesService {
  private users: Map<DeviceId, UserId>;
  private devices: Map<UserId, Map<DeviceId, DeviceModel>>;

  constructor(
    private devicesSubscriptionService: DevicesSubscriptionService,
    private devicesSocketService: DevicesSocketService,
  ) {
    this.users = new Map();
    this.devices = new Map();
  }

  existsByUserIdAndDeviceId(userId: string, deviceId: string): boolean {
    return this.users.get(deviceId) === userId;
  }

  getAllByUserId(userId: string): DeviceModel[] {
    return Array.from(this.devices.get(userId).values());
  }

  getByClient(client: Socket): DeviceModel {
    const deviceId = deviceIdConvertor.fromClientId(client.id);

    const userId = this.users.get(deviceId);
    return this.devices.get(userId)?.get(deviceId);
  }

  add(client: Socket, userId: string, info: DeviceInfoModel): void {
    this.devicesSocketService.addClient(client);

    const deviceId = deviceIdConvertor.fromClientId(client.id);
    this.users.set(deviceId, userId);

    const device: DeviceModel = {
      id: deviceId,
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

  remove(client: Socket): void {
    this.devicesSocketService.removeClient(client);

    const deviceId = deviceIdConvertor.fromClientId(client.id);
    this.users.delete(deviceId);

    const userId = this.users.get(deviceId);
    this.devices.get(userId)?.delete(deviceId);
    if (this.devices.get(userId).size == 0) {
      this.devices.delete(userId);
    }
  }

  async refreshStatus(
    deviceId: string,
    status: DeviceStatusModel,
  ): Promise<DeviceModel> {
    const userId = this.users.get(deviceId);
    const device = this.devices.get(userId).get(deviceId);
    const updatedDevice: DeviceModel = { ...device, status };
    this.devices.get(userId).set(deviceId, updatedDevice);

    await this.devicesSubscriptionService.publish(
      'deviceStatusUpdated',
      updatedDevice,
    );

    return updatedDevice;
  }

  async setStatus(
    deviceId: string,
    status: DeviceStatusModel,
  ): Promise<DeviceModel> {
    const userId = this.users.get(deviceId);
    const device = this.devices.get(userId).get(deviceId);
    const updatedDevice: DeviceModel = { ...device, status };
    this.devices.get(userId).set(deviceId, updatedDevice);

    const clientId = deviceIdConvertor.toClientId(deviceId);
    await this.devicesSocketService.emit(clientId, 'SET_DEVICE_STATUS', status);

    await this.devicesSubscriptionService.publish(
      'deviceStatusUpdated',
      updatedDevice,
    );

    return updatedDevice;
  }
}
