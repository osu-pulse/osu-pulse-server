import { Query, Resolver, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { DeviceObject } from '../objects/device.object';
import { Auth } from '../../auth/decorators/auth.decorator';
import { DeviceModel } from '../models/device.model';
import { DevicesService } from '../services/devices.service';
import { DevicesSubscriptionService } from '../services/devices-subscription.service';

@Resolver(() => DeviceObject)
export class DevicesResolver {
  constructor(
    private devicesService: DevicesService,
    private devicesSubService: DevicesSubscriptionService,
  ) {}

  @UseGuards(OauthGuard)
  @Query(() => [DeviceObject])
  async devices(@Auth() userId: string): Promise<DeviceModel[]> {
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
