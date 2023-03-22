import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LibraryDocument, LibraryModel } from '../models/library.model';
import { CreateLibrary } from '../types/create-library';

@Injectable()
export class LibrariesService {
  constructor(
    @InjectModel(LibraryModel.name)
    private libraryModel: Model<LibraryDocument>,
  ) {}

  async existsByUserId(userId: string): Promise<boolean> {
    return Boolean(await this.libraryModel.exists({ userId }).lean());
  }

  async create(payload: CreateLibrary): Promise<LibraryModel> {
    return this.libraryModel.create({ ...payload, trackIds: [] });
  }
}
