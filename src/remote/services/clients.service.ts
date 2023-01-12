import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ClientsService {
  private clients: Map<string, Socket>;

  constructor() {
    this.clients = new Map();
  }

  get(clientId: string): Socket | null {
    return this.clients.get(clientId);
  }

  has(clientId: string): boolean {
    return this.clients.has(clientId);
  }

  add(client: Socket): void {
    this.clients.set(client.id, client);
  }

  remove(clientId: string): void {
    this.clients.delete(clientId);
  }
}
