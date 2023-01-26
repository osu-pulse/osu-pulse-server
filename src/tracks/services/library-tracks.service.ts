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
    cursor?: string,
    limit?: number,
  ): Promise<WithCursor<TrackModel>> {
    const { trackIds } = await this.libraryModel
      .findOne({ userId })
      .select('trackIds')
      .lean({ virtuals: true });

    const cursorId = cursor && cursorConvertor.toString(cursor);
    const cursorIndex = trackIds.findIndex((id) => id === cursorId);
    const chunkTrackIds = trackIds.slice(
      cursorIndex + 1,
      cursorIndex + 1 + limit,
    );

    const data = await this.tracksService.getAllByIds(chunkTrackIds);

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

  async moveTrackByUserId(
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
