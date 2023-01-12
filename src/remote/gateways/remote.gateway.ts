import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { EnvironmentDto } from '../../core/dto/environment.dto';
import { ClientsService } from '../services/clients.service';
import { userAgentConvertor } from '../convertors/user-agent.convertor';
import { DevicesService } from '../services/devices.service';
import { AuthService } from '../../auth/services/auth.service';
import { DeviceTargetCommand } from '../constants/device-target-command';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { ReqAuth } from '../../auth/decorators/req-auth.decorator';
import { RemoteControlService } from '../services/remote-control.service';
import { NotConnectedException } from '../exceptions/not-connected.exception';

const configService = new ConfigService<EnvironmentDto, true>();

@WebSocketGateway({
  namespace: '/remote',
  cors: configService.get('CORS') && { origin: '*', credentials: true },
})
export class RemoteGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private clientsService: ClientsService,
    private devicesService: DevicesService,
    private remoteControlService: RemoteControlService,
    private authService: AuthService,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const headers = client.handshake.headers;

    const token = headers.authorization?.replace('Bearer ', '');
    if (!token) {
      client.disconnect(true);
      return;
    }

    const userId = await this.authService.validateToken(token);
    if (!userId) {
      client.disconnect(true);
      return;
    }

    const userAgent = headers['user-agent'];
    const deviceInfo = userAgentConvertor.toDeviceInfoModel(userAgent);

    this.clientsService.add(client);
    this.devicesService.add(userId, client.id, deviceInfo);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    if (this.clientsService.has(client.id)) {
      this.clientsService.remove(client.id);
      this.devicesService.remove(client.id);
    }
  }

  @SubscribeMessage('command')
  @UseGuards(OauthGuard)
  async command(
    @MessageBody() data: DeviceTargetCommand,
    @ReqAuth() userId: string,
  ): Promise<void> {
    const deviceValid = this.devicesService.existsByUserIdAndDeviceId(
      userId,
      data.target,
    );
    if (!deviceValid) {
      throw new NotConnectedException();
    }

    await this.remoteControlService.sendCommand(data);
  }
}
