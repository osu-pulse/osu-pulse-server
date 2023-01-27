import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TrackCoverObject } from './track-cover.object';
import { TrackUrlObject } from './track-url.object';
import { TrackCoverModel } from '../models/track-cover.model';
import { TrackUrlModel } from '../models/track-url.model';

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

  @Field(() => TrackCoverObject)
  cover: TrackCoverModel;

  @Field(() => TrackUrlObject)
  url: TrackUrlModel;
}
