import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { SortOrderType } from '../constants/sort-order-type';

@InputType()
export class SortFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  field?: string;

  @Field(() => SortOrderType, { nullable: true })
  @IsOptional()
  @IsEnum(SortOrderType)
  order?: SortOrderType;
}
