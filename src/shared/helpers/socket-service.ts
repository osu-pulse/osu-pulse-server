import { Socket } from 'socket.io';
import { SocketTimeoutException } from '../exceptions/socket-timout.exception';
import { NotConnectedException } from '../exceptions/not-connected.exception';

export abstract class SocketService<
  E extends (trigger: any, payload: any) => void = undefined,
  R extends (trigger: any, payload: any) => any = undefined,
> {
  private clients: Map<string, Socket>;

  protected constructor() {
    this.clients = new Map();
  }

  addClient(client: Socket): void {
    this.clients.set(client.id, client);
  }

  removeClient(client: Socket): void {
    this.clients.delete(client.id);
  }

  async emit(
    clientId: string,
    trigger: Parameters<E>[0],
    payload: Parameters<E>[1],
  ): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) {
      throw new NotConnectedException();
    }

    client.emit(trigger, payload);
  }

  async request(
    clientId: string,
    trigger: Parameters<R>[0],
    payload: Parameters<R>[1],
  ): Promise<ReturnType<R>> {
    const client = this.clients.get(clientId);
    if (!client) {
      throw new NotConnectedException();
    }

    return new Promise<ReturnType<R>>((resolve, reject) => {
      client.timeout(5000).emit(trigger, payload, (err, res) => {
        if (err) {
          reject(new SocketTimeoutException());
        } else {
          resolve(res);
        }
      });
    });
  }
}
