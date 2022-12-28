import { Module } from '@nestjs/common';
import { OSU_AUTH } from './constants/osu-auth';
import { auth, v2 } from 'osu-api-extended';
import { OSU_CLIENT } from './constants/osu-client';
import { OsuService } from './services/osu.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [
    { provide: OSU_AUTH, useValue: auth },
    { provide: OSU_CLIENT, useValue: v2 },
    OsuService,
  ],
  exports: [OsuService],
})
export class OsuModule {}
