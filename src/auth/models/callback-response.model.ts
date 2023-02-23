import { Session } from '../types/session';

export interface CallbackResponseModel {
  session: Session;
  accessToken: string;
  refreshToken: string;
}
