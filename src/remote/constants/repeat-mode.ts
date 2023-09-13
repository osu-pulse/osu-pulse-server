import { registerEnumType } from '@nestjs/graphql';

export enum RepeatMode {
  OFF = 'OFF',
  SINGLE = 'SINGLE',
  LIST = 'LIST',
}

registerEnumType(RepeatMode, { name: 'RepeatMode' });
