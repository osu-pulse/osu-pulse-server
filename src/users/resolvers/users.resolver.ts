import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UsersService } from '../services/users.service';
import { UserObject } from '../objects/user.object';
import { UserModel } from '../models/user.model';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { UserUrlObject } from '../objects/user-url.object';
import { UserUrlModel } from '../models/user-url.model';
import { Auth } from '../../auth/decorators/auth.decorator';

@Resolver(() => UserObject)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @UseGuards(OauthGuard)
  @Query(() => UserObject)
  async me(@Auth() userId: string): Promise<UserModel> {
    return this.usersService.getMe(userId);
  }
}
