import { Injectable } from '@nestjs/common';
import { Device } from '../types/device';

@Injectable()
export class DevicesService {
  private devices: Map<string, Device>;
  private userDevices: Map<string, Set<string>>;

  constructor() {
    this.devices = new Map();
    this.userDevices = new Map();
  }

  existsByUserIdAndId(userId: string, id: string): boolean {
    return this.userDevices.has(userId) && this.userDevices.get(userId).has(id);
  }

  getById(deviceId: string): Device | undefined {
    return this.devices.get(deviceId);
  }

  getAllByUserId(userId: string): Device[] {
    const deviceIds = this.userDevices.get(userId);

    return !deviceIds
      ? []
      : Array.from(deviceIds).map((deviceId) => this.devices.get(deviceId));
  }

  create(device: Device): Device {
    this.devices.set(device.id, device);

    if (!this.userDevices.has(device.userId)) {
      this.userDevices.set(device.userId, new Set([device.id]));
    } else {
      this.userDevices.get(device.userId).add(device.id);
    }

    return device;
  }

  remove(deviceId: string): Device | undefined {
    const device = this.devices.get(deviceId);

    if (device) {
      this.devices.delete(deviceId);
      this.userDevices.get(device.userId).delete(deviceId);
      if (this.userDevices.get(device.userId).size === 0) {
        this.userDevices.delete(device.userId);
      }
    }

    return device;
  }
}
