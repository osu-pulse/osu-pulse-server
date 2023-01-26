import { registerEnumType } from '@nestjs/graphql';

export enum SortOrderType {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortOrderType, { name: 'SortOrderType' });
