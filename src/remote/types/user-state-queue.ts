import { ShuffleMode } from '../constants/shuffle-mode';
import { RepeatMode } from '../constants/repeat-mode';

export interface UserStateQueue {
  current?: string;
  shuffle: ShuffleMode;
  repeat: RepeatMode;
}
