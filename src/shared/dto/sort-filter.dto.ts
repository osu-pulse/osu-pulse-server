import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { OrderTypeDto } from './order-type.dto';

@InputType('SortFilter')
export class SortFilterDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  field?: string;

  @Field(() => OrderTypeDto, { nullable: true })
  @IsOptional()
  @IsEnum(OrderTypeDto)
  order?: OrderTypeDto;
}
