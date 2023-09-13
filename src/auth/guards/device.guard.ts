import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { unknownContextConvertor } from '../../shared/convertors/unknown-context.convertor';
import { AuthService } from '../services/auth.service';
import { ConnectorService } from '../../remote/services/connector.service';

@Injectable()
export class DeviceGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private connectorService: ConnectorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = unknownContextConvertor.toHttpRequest(context);

    const userAgent = req.headers['user-agent'];
    if (!userAgent) {
      return false;
    }

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return false;
    }

    const userId = await this.authService.validateToken(token);
    if (!userId) {
      return false;
    }

    const device = await this.connectorService.connect(userId, userAgent);

    req['user'] = userId;
    req['device'] = device.id;

    return true;
  }
}
