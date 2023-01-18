import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LibraryDocument, LibraryModel } from '../models/library.model';
import { WithCursor } from '../../shared/types/with-cursor';
import { TrackModel } from '../models/track.model';
import { cursorConvertor } from '../../shared/convertors/cursor.convertor';
import { TracksService } from './tracks.service';

@Injectable()
export class LibrariesService {
  constructor(
    @InjectModel(LibraryModel.name)
    private libraryModel: Model<LibraryDocument>,
  ) {}

  async existsByUserId(userId: string): Promise<boolean> {
    return Boolean(await this.libraryModel.exists({ userId }).lean());
  }

  async create(userId: string): Promise<LibraryModel> {
    return this.libraryModel.create({ userId, trackIds: [] });
  }
}
