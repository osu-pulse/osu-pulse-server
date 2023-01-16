import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LibraryDocument, LibraryModel } from '../models/library.model';

@Injectable()
export class LibraryTracksService {
  constructor(
    @InjectModel(LibraryModel.name)
    private libraryModel: Model<LibraryDocument>,
  ) {}

  async getByUserId(userId: string): Promise<LibraryModel> {
    return this.libraryModel.findOne({ userId }).lean();
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
    let { trackIds } = await this.libraryModel.findOne({ userId }).lean();
    trackIds = trackIds.filter((id) => id !== trackId);
    trackIds.splice(position, 0, trackId);

    await this.libraryModel.updateOne({ userId }, { trackIds });
  }
}
