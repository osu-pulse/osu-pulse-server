import { Injectable } from '@nestjs/common';

type UserId = string;
type AccessToken = string;

@Injectable()
export class AccessTokenHolderService {
  private accessTokens: Map<UserId, AccessToken>;

  constructor() {
    this.accessTokens = new Map();
  }

  get(userId: string): AccessToken | undefined {
    return this.accessTokens.get(userId);
  }

  set(userId: string, accessToken: string): void {
    this.accessTokens.set(userId, accessToken);
  }

  remove(userId: string): void {
    this.accessTokens.delete(userId);
  }
}
