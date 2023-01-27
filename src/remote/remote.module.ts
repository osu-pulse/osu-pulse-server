import { Module } from '@nestjs/common';
import { RemoteGateway } from './gateways/remote.gateway';
import { AuthModule } from '../auth/auth.module';
import { DevicesService } from './services/devices.service';
import { DevicesResolver } from './resolvers/devices.resolver';
import { DevicesSubscriptionService } from './services/devices-subscription.service';
import { DevicesSocketService } from './services/devices-socket.service';

@Module({
  imports: [AuthModule],
  providers: [
    RemoteGateway,
    DevicesService,
    DevicesResolver,
    DevicesSubscriptionService,
    DevicesSocketService,
  ],
})
export class RemoteModule {}
