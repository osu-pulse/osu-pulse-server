import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

@ObjectType('Cover')
export class CoverObject {
  @ApiProperty()
  @Field()
  @IsUrl()
  small: string;

  @ApiProperty()
  @Field()
  @IsUrl()
  normal: string;
}
