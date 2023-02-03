import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserUrlObject } from './user-url.object';
import { UserUrlModel } from '../models/user-url.model';

@ObjectType()
export class UserObject {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  username: string;

  @Field(() => UserUrlObject)
  url: UserUrlModel;
}
