import { LibraryModel } from '../models/library.model';

export type CreateLibrary = Pick<LibraryModel, 'userId'>;
