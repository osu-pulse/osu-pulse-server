// noinspection JSUnusedGlobalSymbols

import { registerEnumType } from '@nestjs/graphql';

export enum OrderTypeDto {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(OrderTypeDto, {
  name: 'OrderType',
});
