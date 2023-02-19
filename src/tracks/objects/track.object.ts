import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TrackCoverObject } from './track-cover.object';
import { TrackUrlObject } from './track-url.object';

@ObjectType()
export class TrackObject {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  artist: string;

  @Field(() => Number)
  played: number;

  @Field(() => Number)
  liked: number;

  @Field(() => Boolean)
  cached: boolean;

  @Field(() => Number, { nullable: true })
  duration?: number;

  @Field(() => TrackCoverObject)
  cover: TrackCoverObject;

  @Field(() => TrackUrlObject)
  url: TrackUrlObject;
}
