import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DevicesService } from './services/devices.service';
import { DevicesResolver } from './resolvers/devices.resolver';
import { ConnectorService } from './services/connector.service';
import { UserStatesService } from './services/user-states.service';
import { DevicesPubSubService } from './services/devices-pub-sub.service';

@Module({
  imports: [AuthModule],
  providers: [
    DevicesService,
    DevicesResolver,
    DevicesPubSubService,
    ConnectorService,
    DevicesService,
    UserStatesService,
  ],
  exports: [ConnectorService],
})
export class RemoteModule {}
