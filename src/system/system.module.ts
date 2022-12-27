import { Module } from '@nestjs/common';
import { SystemController } from './controllers/system.controller';
import { SystemResolver } from './resolvers/system.resolver';

@Module({
  providers: [SystemResolver],
  controllers: [SystemController],
})
export class SystemModule {}
