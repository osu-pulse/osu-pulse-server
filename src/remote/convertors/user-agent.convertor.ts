import { DeviceInfoModel } from '../models/device-info.model';
import DeviceDetector from 'device-detector-js';
import { switchAssign } from '../../shared/helpers/switch.helper';
import { DeviceType } from '../constants/device-type';

export const userAgentConvertor = {
  toDeviceInfoModel(userAgent: string): DeviceInfoModel {
    const deviceDetector = new DeviceDetector();
    const device = deviceDetector.parse(userAgent);
    return {
      type: switchAssign(
        device.device.type as string,
        {
          desktop: DeviceType.DESKTOP,
          smartphone: DeviceType.MOBILE,
          tablet: DeviceType.MOBILE,
        },
        DeviceType.OTHER,
      ) as DeviceType,
      device: device.os.name,
      client: device.client.name,
    };
  },
};
