import { Field, ObjectType } from '@nestjs/graphql';
import { TrackObject } from './track.object';

@ObjectType('TracksWithCursor')
export class TracksWithCursorObject {
  @Field(() => [TrackObject])
  data: TrackObject[];

  @Field(() => String, { nullable: true })
  cursor?: string;
}
