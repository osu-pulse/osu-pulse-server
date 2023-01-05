import { Field, ObjectType } from '@nestjs/graphql';
import { TrackObject } from './track.object';

@ObjectType('TracksWithCursor')
export class TracksWithCursorObject {
  @Field(() => String)
  cursor: string;

  @Field(() => [TrackObject])
  tracks: TrackObject[];
}
