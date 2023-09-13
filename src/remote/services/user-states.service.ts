import { Injectable } from '@nestjs/common';
import { UserState } from '../types/user-state';

@Injectable()
export class UserStatesService {
  private states: Map<string, UserState>;

  constructor() {
    this.states = new Map();
  }

  getById(userId: string): UserState | undefined {
    return this.states.get(userId);
  }

  create(state: UserState): UserState {
    this.states.set(state.userId, state);
    return state;
  }

  remove(userId: string): void {
    this.states.delete(userId);
  }
}
