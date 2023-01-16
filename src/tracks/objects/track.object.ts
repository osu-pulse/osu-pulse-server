import { Field, ObjectType } from '@nestjs/graphql';
import { TrackCoverObject } from './track-cover.object';
import { TrackUrlObject } from './track-url.object';

@ObjectType('Track')
export class TrackObject {
  @Field(() => String)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  artist: string;

  @Field(() => Number)
  played: number;

  @Field(() => Number)
  liked: number;

  @Field(() => TrackCoverObject)
  cover: TrackCoverObject;

  @Field(() => TrackUrlObject)
  url: TrackUrlObject;

  @Field(() => Boolean)
  cached: boolean;
}
