import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { WithCursor } from '../../shared/types/with-cursor';
import { cursorConvertor } from '../../shared/convertors/cursor.convertor';
import { PlaylistDocument, PlaylistModel } from '../models/playlist.model';
import { TracksService } from '../../tracks/services/tracks.service';
import { TrackModel } from '../../tracks/models/track.model';

@Injectable()
export class PlaylistTracksService {
  constructor(
    @InjectModel(PlaylistModel.name)
    private playlistModel: Model<PlaylistDocument>,
    private tracksService: TracksService,
  ) {}

  async getAllTracksByPlaylistId(
    playlistId: string,
    limit?: number,
    cursor?: string,
  ): Promise<WithCursor<TrackModel>> {
    const { trackIds } = await this.playlistModel
      .findOne({ _id: playlistId })
      .select('trackIds')
      .lean();

    let tracks = await this.tracksService.getAllByIds(trackIds);

    if (cursor) {
      const cursorId = cursorConvertor.toString(cursor);
      const cursorIndex = tracks.findIndex(({ id }) => id === cursorId);
      tracks = tracks.slice(cursorIndex + 1);
    }

    if (limit != null) {
      tracks = tracks.slice(0, limit);
    }

    return {
      data: tracks,
      cursor: tracks.length && cursorConvertor.fromString(tracks.at(-1).id),
    };
  }

  async addTrackIdByPlaylistId(
    playlistId: string,
    trackId: string,
  ): Promise<void> {
    await this.playlistModel.updateOne(
      { playlistId },
      {
        $push: {
          trackIds: {
            $each: [trackId],
            $position: 0,
          },
        },
      },
    );
  }

  async removeTrackIdByPlaylistId(
    playlistId: string,
    trackId: string,
  ): Promise<void> {
    await this.playlistModel.updateOne(
      { playlistId },
      {
        $pull: { trackIds: trackId },
      },
    );
  }

  async moveTrackIdByPlaylistId(
    playlistId: string,
    trackId: string,
    position: number,
  ): Promise<void> {
    let { trackIds } = await this.playlistModel
      .findOne({ playlistId })
      .select('trackIds')
      .lean();
    trackIds = trackIds.filter((id) => id !== trackId);
    trackIds.splice(position, 0, trackId);

    await this.playlistModel.updateOne({ playlistId }, { trackIds });
  }
}
