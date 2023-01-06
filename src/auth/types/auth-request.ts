import { Request } from 'express';

export type AuthContext = string;

export interface AuthRequest extends Request {
  user?: AuthContext;
}
