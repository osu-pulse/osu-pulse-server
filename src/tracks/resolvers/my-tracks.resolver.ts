import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OauthGuard } from '../../auth/guards/oauth.guard';
import { Auth } from '../../auth/decorators/auth.decorator';
import { TrackObject } from '../objects/track.object';
import { TracksService } from '../services/tracks.service';
import { WithCursor } from '../../shared/types/with-cursor';
import { TracksWithCursorObject } from '../objects/tracks-with-cursor.object';
import { TrackNotFoundException } from '../exceptions/track-not-found.exception';
import { TrackModel } from '../models/track.model';
import { UserTrackMappingsService } from '../services/user-track-mappings.service';

@Resolver(() => TrackObject)
export class MyTracksResolver {
  constructor(
    private userTrackMappingsService: UserTrackMappingsService,
    private tracksService: TracksService,
  ) {}

  @UseGuards(OauthGuard)
  @Query(() => TracksWithCursorObject)
  async myTracks(
    @Args('cursor', { nullable: true })
    cursor: string | undefined,
    @Args('limit', { nullable: true })
    limit: number | undefined = 50,
    @Auth()
    userId: string,
  ): Promise<WithCursor<TrackModel>> {
    const mappings = await this.userTrackMappingsService.getAllByUserId(
      userId,
      cursor,
      limit,
    );
    const trackIds = mappings.data.map(({ trackId }) => trackId);

    const data = await this.tracksService.getAllByIds(trackIds);
    return { data, cursor: mappings.cursor };
  }

  @UseGuards(OauthGuard)
  @Mutation(() => TrackObject)
  async addMyTrack(
    @Args('trackId')
    trackId: string,
    @Auth()
    userId: string,
  ): Promise<TrackModel> {
    const trackExists = await this.tracksService.existsById(trackId);
    if (!trackExists) {
      throw new TrackNotFoundException();
    }

    await this.userTrackMappingsService.create({ userId, trackId });
    return this.tracksService.getById(trackId);
  }

  @UseGuards(OauthGuard)
  @Mutation(() => TrackObject)
  async removeMyTrack(
    @Args('trackId')
    trackId: string,
    @Auth()
    userId: string,
  ): Promise<TrackModel> {
    const trackExists = await this.tracksService.existsById(trackId);
    if (!trackExists) {
      throw new TrackNotFoundException();
    }

    await this.userTrackMappingsService.remove({ userId, trackId });
    return this.tracksService.getById(trackId);
  }

  @UseGuards(OauthGuard)
  @Mutation(() => TrackObject)
  async moveMyTrack(
    @Args('trackId')
    trackId: string,
    @Args('position')
    position: number,
    @Auth()
    userId: string,
  ): Promise<TrackModel> {
    const trackExists = await this.tracksService.existsById(trackId);
    if (!trackExists) {
      throw new TrackNotFoundException();
    }

    await this.userTrackMappingsService.move({ userId, trackId }, position);
    return this.tracksService.getById(trackId);
  }
}
