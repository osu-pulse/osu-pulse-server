import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface GuardWithUnknownContext {
  getRequest(context: ExecutionContext): Request;
}
