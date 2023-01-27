import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LibraryDocument, LibraryModel } from '../models/library.model';
import { WithCursor } from '../../shared/types/with-cursor';
import { TrackModel } from '../models/track.model';
import { cursorConvertor } from '../../shared/convertors/cursor.convertor';
import { TracksService } from './tracks.service';
import { sliceArrayByCursor } from '../../shared/helpers/cursor';

@Injectable()
export class LibraryTracksService {
  constructor(
    @InjectModel(LibraryModel.name)
    private libraryModel: Model<LibraryDocument>,
    private tracksService: TracksService,
  ) {}

  async getAllTracksByUserId(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<WithCursor<TrackModel>> {
    const { trackIds } = await this.libraryModel
      .findOne({ userId })
      .select('trackIds')
      .lean();

    const trackIdsSlice = sliceArrayByCursor(trackIds, limit, cursor);
    const data = await this.tracksService.getAllByIds(trackIdsSlice);

    const newCursorId = data.at(-1)?.id;
    const newCursor = newCursorId && cursorConvertor.fromString(newCursorId);

    return { data, cursor: newCursor };
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
