import { DeviceCommandType } from './device-command-type';

export interface DeviceCommandBase<C extends DeviceCommandType, P = undefined> {
  type: C;
  data: P;
}

export type DeviceCommand =
  | DeviceCommandBase<DeviceCommandType.PLAY>
  | DeviceCommandBase<DeviceCommandType.PAUSE>
  | DeviceCommandBase<DeviceCommandType.CHANGE_TRACK, string>
  | DeviceCommandBase<DeviceCommandType.CHANGE_VOLUME, number>
  | DeviceCommandBase<DeviceCommandType.CHANGE_PROGRESS, number>;
