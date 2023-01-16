import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';
import { switchExec } from '../helpers/switch';
import { Request } from 'express';

export const unknownContextConvertor = {
  toHttpRequest(context: ExecutionContext): Request {
    return switchExec(context.getType<GqlContextType>(), {
      graphql: () => GqlExecutionContext.create(context).getContext().req,
      http: () => context.switchToHttp().getRequest(),
      ws: () => context.switchToWs().getClient().handshake,
      rpc: () => context.switchToRpc().getContext().req,
    });
  },
};
