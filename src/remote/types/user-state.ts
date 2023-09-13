import { UserStateOptions } from './user-state-options';
import { UserStatePlaying } from './user-state-playing';
import { UserStateQueue } from './user-state-queue';

export interface UserState {
  userId: string;
  options: UserStateOptions;
  playing: UserStatePlaying;
  queue: UserStateQueue;
}
