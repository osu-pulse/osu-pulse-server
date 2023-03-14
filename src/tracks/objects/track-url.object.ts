import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TrackUrlObject {
  @Field(() => String)
  page: string;

  @Field(() => String)
  file: string;

  @Field(() => String)
  map: string;

  @Field(() => String, { nullable: true })
  audio?: string;
}
