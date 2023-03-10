import { DeviceStatusModel } from './device-status.model';
import { DeviceInfoModel } from './device-info.model';

export interface DeviceModel {
  id: string;
  userId: string;
  info: DeviceInfoModel;
  status: DeviceStatusModel;
}
