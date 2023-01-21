import { registerEnumType } from '@nestjs/graphql';

export enum DeviceType {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
  OTHER = 'OTHER',
}

registerEnumType(DeviceType);
