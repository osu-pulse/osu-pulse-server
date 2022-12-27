import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';

@InputType('PaginationFilter')
export class PaginationFilterDto {
  @Field({ nullable: true })
  @IsOptional()
  @Min(0)
  offset?: number;

  @Field({ nullable: true })
  @IsOptional()
  @Min(0)
  limit?: number;
}
