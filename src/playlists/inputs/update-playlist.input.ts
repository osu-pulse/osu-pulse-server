import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdatePlaylistInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  public?: string;

  @Field(() => String, { nullable: true })
  cover?: string;
}
