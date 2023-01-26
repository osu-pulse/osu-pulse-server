import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePlaylistInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  public: string;

  @Field(() => String, { nullable: true })
  cover?: string;
}
