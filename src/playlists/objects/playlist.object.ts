import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TrackModel } from '../../tracks/models/track.model';
import { TrackObject } from '../../tracks/objects/track.object';

@ObjectType()
export class PlaylistObject {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  public: string;

  @Field(() => String, { nullable: true })
  cover?: string;

  @Field(() => String)
  userId: string;

  @Field(() => [String])
  trackIds: string[];

  @Field(() => [TrackObject])
  tracks: TrackModel[];
}
