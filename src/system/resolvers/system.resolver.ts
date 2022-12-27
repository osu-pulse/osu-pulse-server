import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class SystemResolver {
  @Query(() => Boolean)
  async health(): Promise<boolean> {
    return true;
  }
}
