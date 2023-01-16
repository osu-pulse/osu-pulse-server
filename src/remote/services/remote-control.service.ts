import { Injectable, Logger } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { DeviceTargetCommand } from '../constants/device-target-command';
import { omit } from '../../shared/helpers/object';
import { DevicesService } from './devices.service';
import { switchAssign } from '../../shared/helpers/switch.helper';
import { DeviceCommandType } from '../constants/device-command-type';

@Injectable()
export class RemoteControlService {
  private readonly logger = new Logger(RemoteControlService.name);

  constructor(
    private clientsService: ClientsService,
    private devicesService: DevicesService,
  ) {}

  private async updateStatusByCommand(
    deviceTargetCommand: DeviceTargetCommand,
  ): Promise<void> {
    const { type, data, target } = deviceTargetCommand;
    const { status } = this.devicesService.getDeviceById(target);

    const updatedStatus = {
      ...status,
      ...switchAssign(type, {
        [DeviceCommandType.PLAY]: { playing: true },
        [DeviceCommandType.PAUSE]: { playing: false },
        [DeviceCommandType.CHANGE_TRACK]: { trackId: data as string },
        [DeviceCommandType.CHANGE_VOLUME]: { volume: data as number },
        [DeviceCommandType.CHANGE_PROGRESS]: { progress: data as number },
      }),
    };

    await this.devicesService.updateStatus(
      deviceTargetCommand.target,
      updatedStatus,
    );
  }

  async sendCommand(deviceTargetCommand: DeviceTargetCommand): Promise<void> {
    const client = this.clientsService.get(deviceTargetCommand.target);

    client.emit('command', omit(deviceTargetCommand, ['target']));

    this.logger.verbose(`Command sent: ${JSON.stringify(deviceTargetCommand)}`);

    await this.updateStatusByCommand(deviceTargetCommand);
  }
}
