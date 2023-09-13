import { registerEnumType } from '@nestjs/graphql';

export enum ShuffleMode {
  OFF = 'OFF',
  ON = 'ON',
}

registerEnumType(ShuffleMode, { name: 'ShuffleMode' });
