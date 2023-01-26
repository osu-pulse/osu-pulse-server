import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { userAgentConvertor } from '../convertors/user-agent.convertor';
import { DevicesService } from '../services/devices.service';
import { AuthService } from '../../auth/services/auth.service';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { Auth } from '../../auth/decorators/auth.decorator';
import { NotConnectedException } from '../exceptions/not-connected.exception';
import { ConfigService } from '@nestjs/config';
import { Env } from '../../core/types/env';
import { SetDeviceStatusDto } from '../dto/set-device-status.dto';
import { DeviceStatusDto } from '../dto/device-status.dto';

const configService = new ConfigService<Env, true>();

@WebSocketGateway({
  namespace: '/remote',
  cors: configService.get('CORS') && { origin: true, credentials: true },
})
export class RemoteGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private devicesService: DevicesService,
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

    this.devicesService.add(client, userId, deviceInfo);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.devicesService.remove(client);
  }

  @SubscribeMessage('SET_DEVICE_STATUS')
  @UseGuards(OauthGuard)
  async setDeviceStatus(
    @MessageBody() data: SetDeviceStatusDto,
    @Auth() userId: string,
  ): Promise<void> {
    const deviceConnected = this.devicesService.existsByUserIdAndDeviceId(
      userId,
      data.deviceId,
    );
    if (!deviceConnected) {
      throw new NotConnectedException();
    }

    await this.devicesService.setStatus(data.deviceId, data.status);
  }

  @SubscribeMessage('REFRESH_DEVICE_STATUS')
  @UseGuards(OauthGuard)
  async refreshDeviceStatus(
    @MessageBody() payload: DeviceStatusDto,
    @Auth() userId: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const device = this.devicesService.getByClient(client);
    if (!device) {
      throw new NotConnectedException();
    }

    await this.devicesService.refreshStatus(device.id, payload);
  }
}
