import { WsException } from '@nestjs/websockets';

export class NotConnectedException extends WsException {
  constructor() {
    super('Device is not connected');
  }
}
