import { Query, Resolver, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { DeviceObject } from '../objects/device.object';
import { ReqAuth } from '../../auth/decorators/req-auth.decorator';
import { DeviceModel } from '../models/device.model';
import { DevicesService } from '../services/devices.service';
import { DevicesSubService } from '../services/devices-sub.service';

@Resolver(() => DeviceObject)
export class DevicesResolver {
  constructor(
    private devicesService: DevicesService,
    private devicesSubService: DevicesSubService,
  ) {}

  @UseGuards(OauthGuard)
  @Query(() => [DeviceObject])
  async devices(@ReqAuth() userId: string): Promise<DeviceModel[]> {
    return this.devicesService.getAllByUserId(userId);
  }

  @UseGuards(OauthGuard)
  @Subscription(() => DeviceObject, {
    filter(payload, variables, context) {
      const device = payload.deviceStatusUpdated as DeviceModel;
      const userId = context.req.user as string;
      return device.userId === userId;
    },
  })
  async deviceStatusUpdated() {
    return this.devicesSubService.iterator('deviceStatusUpdated');
  }
}