import { Injectable } from '@nestjs/common';
import { DeviceModel } from '../models/device.model';
import { DeviceInfoModel } from '../models/device-info.model';
import { DeviceStatusModel } from '../models/device-status.model';
import { DevicesSubService } from './devices-sub.service';
import { Socket } from 'socket.io';
import { deviceIdConvertor } from '../../shared/convertors/device-id.convertor';

type UserId = string;
type DeviceId = string;

@Injectable()
export class DevicesService {
  private clients: Map<DeviceId, Socket>;
  private users: Map<DeviceId, UserId>;
  private devices: Map<UserId, Map<DeviceId, DeviceModel>>;

  constructor(private devicesSubService: DevicesSubService) {
    this.clients = new Map();
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
    return this.devices.get(userId).get(deviceId);
  }

  getClientByDeviceId(deviceId: string): Socket {
    return this.clients.get(deviceId);
  }

  add(client: Socket, userId: string, info: DeviceInfoModel): void {
    const deviceId = deviceIdConvertor.fromClientId(client.id);

    this.clients.set(deviceId, client);
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

  remove(client: Socket): void {
    const deviceId = deviceIdConvertor.fromClientId(client.id);

    this.users.delete(deviceId);
    this.clients.delete(deviceId);

    const userId = this.users.get(deviceId);
    this.devices.get(userId)?.delete(deviceId);
    if (this.devices.get(userId).size == 0) {
      this.devices.delete(userId);
    }
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
}
