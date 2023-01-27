import { Field, ObjectType } from '@nestjs/graphql';
import { TrackObject } from './track.object';
import { TrackModel } from '../models/track.model';

@ObjectType()
export class TracksWithCursorObject {
  @Field(() => [TrackObject])
  data: TrackModel[];

  @Field(() => String, { nullable: true })
  cursor?: string;
}
