import { DeviceType } from '../constants/device-type';

export interface DeviceInfoModel {
  type: DeviceType;
  device: string;
  client: string;
}
