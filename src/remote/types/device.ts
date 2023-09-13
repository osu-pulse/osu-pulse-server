import { DeviceType } from '../constants/device-type';

export interface Device {
  id: string;
  userId: string;
  type: DeviceType;
  model?: string;
  os?: string;
}

export type DeviceInfo = Pick<Device, 'type' | 'model' | 'os'>;
