import { DeviceCommand } from './device-command';

export type DeviceTargetCommand = DeviceCommand & {
  target: string;
};
