import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LibraryDocument, LibraryModel } from '../models/library.model';
import { WithCursor } from '../../shared/types/with-cursor';
import { TrackModel } from '../models/track.model';
import { cursorConvertor } from '../../shared/convertors/cursor.convertor';
import { TracksService } from './tracks.service';

@Injectable()
export class LibraryTracksService {
  constructor(
    @InjectModel(LibraryModel.name)
    private libraryModel: Model<LibraryDocument>,
    private tracksService: TracksService,
  ) {}

  async getAllTracksByUserId(
    userId: string,
    search?: string,
    limit?: number,
    cursor?: string,
  ): Promise<WithCursor<TrackModel>> {
    const { trackIds } = await this.libraryModel
      .findOne({ userId })
      .select('trackIds')
      .lean();

    let tracks = await this.tracksService.getAllByIds(trackIds);

    if (search) {
      const searchRegExp = new RegExp(search, 'i');
      tracks = tracks.filter(
        ({ artist, title }) =>
          searchRegExp.test(artist) || searchRegExp.test(title),
      );
    }

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

  async addTrackIdByUserId(userId: string, trackId: string): Promise<void> {
    await this.libraryModel.updateOne(
      { userId },
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

  async removeTrackIdByUserId(userId: string, trackId: string): Promise<void> {
    await this.libraryModel.updateOne(
      { userId },
      {
        $pull: { trackIds: trackId },
      },
    );
  }

  async moveTrackIdByUserId(
    userId: string,
    trackId: string,
    position: number,
  ): Promise<void> {
    let { trackIds } = await this.libraryModel
      .findOne({ userId })
      .select('trackIds')
      .lean();
    trackIds = trackIds.filter((id) => id !== trackId);
    trackIds.splice(position, 0, trackId);

    await this.libraryModel.updateOne({ userId }, { trackIds });
  }
}
