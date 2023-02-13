import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TracksWithCursorObject } from '../../tracks/objects/tracks-with-cursor.object';

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

  @Field(() => TracksWithCursorObject)
  tracks: TracksWithCursorObject;
}
