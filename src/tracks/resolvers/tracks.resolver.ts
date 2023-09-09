import {
  Args,
  Context,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TracksService } from '../services/tracks.service';
import { TrackObject } from '../objects/track.object';
import { Track } from '../types/track';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { TrackUrlObject } from '../objects/track-url.object';
import { TrackUrl } from '../types/track-url';
import { TrackCoverObject } from '../objects/track-cover.object';
import { TrackCover } from '../types/track-cover';
import { DataLoadersContext } from '../../shared/types/data-loader';
import { createLoader } from '../../shared/helpers/data-loader';

@Resolver(() => TrackObject)
export class TracksResolver {
  constructor(private tracksService: TracksService) {}

  // @UseGuards(OauthGuard)
  @Query(() => [TrackObject])
  async tracks(
    @Args('search', { nullable: true })
    search: string | undefined,
    @Args('limit', { nullable: true, type: () => Int })
    limit: number | undefined,
    @Args('offset', { nullable: true, type: () => Int })
    offset: number | undefined,
  ): Promise<Track[]> {
    return this.tracksService.getAllBySearch(search, limit, offset);
  }

  @UseGuards(OauthGuard)
  @Query(() => TrackObject)
  async track(
    @Args('trackId')
    trackId: string,
  ): Promise<Track> {
    return this.tracksService.getById(trackId);
  }

  @ResolveField(() => TrackUrlObject)
  async url(
    @Parent() track: Track,
    @Context()
    context: DataLoadersContext<{ url: [Track, TrackUrl] }>,
  ): Promise<TrackUrl> {
    const dataLoader = createLoader(
      context,
      'url',
      async (tracks): Promise<TrackUrl[]> =>
        tracks.map((track) => this.tracksService.getUrl(track)),
    );

    return dataLoader.load(track);
  }

  @ResolveField(() => TrackCoverObject)
  async cover(
    @Parent() track: Track,
    @Context() context: DataLoadersContext<{ cover: [Track, TrackCover] }>,
  ): Promise<TrackCover> {
    const dataLoader = createLoader(
      context,
      'cover',
      async (tracks: Track[]): Promise<TrackCover[]> =>
        tracks.map((track) => this.tracksService.getCover(track)),
    );

    return dataLoader.load(track);
  }
}
