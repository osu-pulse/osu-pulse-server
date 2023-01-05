import { Module } from '@nestjs/common';
import { OsuService } from './services/osu.service';
import { ConfigModule } from '@nestjs/config';
import axios from 'axios';
import { AXIOS_KITSU, AXIOS_OSU, AXIOS_OSU_API } from './constants/injections';
import { kitsuApiUrl, osuApiUrl, osuUrl } from './constants/api-url';
import { KitsuService } from './services/kitsu.service';

@Module({
  imports: [ConfigModule],
  providers: [
    { provide: AXIOS_OSU, useValue: axios.create({ baseURL: osuUrl }) },
    { provide: AXIOS_OSU_API, useValue: axios.create({ baseURL: osuApiUrl }) },
    { provide: AXIOS_KITSU, useValue: axios.create({ baseURL: kitsuApiUrl }) },
    OsuService,
    KitsuService,
  ],
  exports: [OsuService, KitsuService],
})
export class OsuModule {}
