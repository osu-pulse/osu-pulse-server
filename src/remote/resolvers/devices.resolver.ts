import { Query, Resolver, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { DeviceObject } from '../objects/device.object';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Device } from '../types/device';
import { DevicesService } from '../services/devices.service';
import { DeviceGuard } from '../../auth/guards/device.guard';
import { DevicesPubSubService } from '../services/devices-pub-sub.service';

@Resolver(() => DeviceObject)
export class DevicesResolver {
  constructor(
    private devicesService: DevicesService,
    private devicesPubSubService: DevicesPubSubService,
  ) {}

  @UseGuards(OauthGuard)
  @Query(() => [DeviceObject])
  async myDevices(@Auth() userId: string): Promise<Device[]> {
    return this.devicesService.getAllByUserId(userId);
  }

  @UseGuards(DeviceGuard)
  @Subscription(() => DeviceObject, {
    filter(payload, variables, context) {
      const device = payload.deviceConnected as Device;
      const userId = context.req.user as string;
      return device.userId === userId;
    },
  })
  async deviceConnected() {
    return this.devicesPubSubService.iterator('deviceConnected');
  }

  @UseGuards(DeviceGuard)
  @Subscription(() => DeviceObject, {
    filter(payload, variables, context) {
      const device = payload.deviceDisconnected as Device;
      const userId = context.req.user as string;
      return device.userId === userId;
    },
  })
  async deviceDisconnected() {
    return this.devicesPubSubService.iterator('deviceDisconnected');
  }
}
