import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInstance,
  IsNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CoverObject } from './cover.object';

@ObjectType('Track')
export class TrackObject {
  @ApiProperty()
  @Field(() => ID)
  @IsNumber()
  id: number;

  @ApiProperty()
  @Field()
  @IsString()
  title: string;

  @ApiProperty()
  @Field()
  @IsString()
  artist: string;

  @ApiProperty()
  @Field(() => CoverObject)
  @Type(() => CoverObject)
  @IsInstance(CoverObject)
  @ValidateNested()
  cover: CoverObject;

  @ApiProperty()
  @Field()
  @IsUrl()
  url: string;
}
