import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInstance,
  IsNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CoverObject } from './cover.object';
import { TrackObject } from './track.object';

@ObjectType('TracksWithCursor')
export class TracksWithCursorObject {
  @ApiProperty()
  @Field()
  @IsString()
  cursor: string;

  @Field(() => [TrackObject])
  @IsArray()
  @Type(() => TrackObject)
  @IsInstance(TrackObject, { each: true })
  @ValidateNested({ each: true })
  tracks: TrackObject[];
}
