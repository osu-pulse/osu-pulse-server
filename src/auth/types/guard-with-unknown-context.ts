import { ExecutionContext } from '@nestjs/common';
import { AuthRequest } from './auth-request';

export interface GuardWithUnknownContext {
  getRequest(context: ExecutionContext): AuthRequest;
}
