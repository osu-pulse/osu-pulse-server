import { registerEnumType } from '@nestjs/graphql';

export enum DeviceType {
  DESKTOP = 'DESKTOP',
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  CONSOLE = 'CONSOLE',
  TV = 'TV',
  OTHER = 'OTHER',
}

registerEnumType(DeviceType, { name: 'DeviceType' });
