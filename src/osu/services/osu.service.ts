import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { OSU_AUTH } from '../constants/osu-auth';
import { OSU_CLIENT } from '../constants/osu-client';
import { EnvironmentDto } from '../../core/dto/environment.dto';
import { ConfigService } from '@nestjs/config';
import { OsuAuth } from '../types/osu-auth';
import { OsuClient } from '../types/osu-client';
import { BeatmapSetsWithCursorDto } from '../dto/beatmap-sets-with-cursor.dto';
import { BeatmapSetDto } from '../dto/beatmap-set.dto';

@Injectable()
export class OsuService implements OnModuleInit {
  constructor(
    @Inject(OSU_AUTH) private auth: OsuAuth,
    @Inject(OSU_CLIENT) private client: OsuClient,
    private configService: ConfigService<EnvironmentDto, true>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.auth.login(
      this.configService.get('OSU_CLIENT_ID'),
      this.configService.get('OSU_CLIENT_SECRET'),
    );
  }

  async getBeatmapSets(
    search?: string,
    cursor?: string,
  ): Promise<BeatmapSetsWithCursorDto> {
    return await this.client.beatmap.search({
      query: search,
      cursor_string: cursor,
    });
  }

  async getBeatmapSetById(beatmapSetId: number): Promise<BeatmapSetDto> {
    return await this.client.beatmap.set(beatmapSetId);
  }
}
