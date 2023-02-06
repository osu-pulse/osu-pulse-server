import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserUrlObject {
  @Field(() => String)
  avatar: string;

  @Field(() => String)
  cover: string;

  @Field(() => String)
  profile: string;
}
