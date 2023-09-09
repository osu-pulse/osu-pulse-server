import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LibraryDocument, LibraryModel } from '../models/library.model';
import { Track } from '../types/track';
import { TracksService } from './tracks.service';
import { isDefined } from 'class-validator';

@Injectable()
export class LibraryTracksService {
  constructor(
    @InjectModel(LibraryModel.name)
    private libraryModel: Model<LibraryDocument>,
    private tracksService: TracksService,
  ) {}

  async existsByUserId(userId: string, trackId: string): Promise<boolean> {
    return Boolean(
      await this.libraryModel.exists({ userId, trackIds: trackId }).lean(),
    );
  }

  async getAllByUserId(
    userId: string,
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<Track[]> {
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

    tracks = tracks.slice(
      isDefined(offset) ? offset : undefined,
      isDefined(limit) ? offset + limit : undefined,
    );

    return tracks;
  }

  async addByUserId(userId: string, trackId: string): Promise<void> {
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

  async removeByUserId(userId: string, trackId: string): Promise<void> {
    await this.libraryModel.updateOne(
      { userId },
      {
        $pull: { trackIds: trackId },
      },
    );
  }

  async moveByUserId(
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
