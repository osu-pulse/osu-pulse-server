import { DeviceInfo } from '../types/device';
import DeviceDetector from 'device-detector-js';
import { switchAssign } from '../../shared/helpers/switch';
import { DeviceType } from '../constants/device-type';

const deviceDetector = new DeviceDetector();

export const userAgentConvertor = {
  toDeviceInfo(userAgent: string): DeviceInfo {
    const { os, device } = deviceDetector.parse(userAgent);

    return {
      type: switchAssign(
        device.type,
        {
          desktop: DeviceType.DESKTOP,
          smartphone: DeviceType.MOBILE,
          tablet: DeviceType.TABLET,
          console: DeviceType.CONSOLE,
          television: DeviceType.TV,
        },
        DeviceType.OTHER,
      ) as DeviceType,
      model:
        device.brand || device.model
          ? `${device.brand} ${device.model}`
          : undefined,
      os: os.name || os.version ? `${os.name} ${os.version}` : undefined,
    };
  },
};
