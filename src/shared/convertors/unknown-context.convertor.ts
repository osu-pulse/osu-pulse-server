import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContext } from '@nestjs/common';
import { switchExec } from '../helpers/switch.helper';
import { AuthRequest } from '../../auth/types/auth-request';

export const unknownContextConvertor = {
  toHttpRequest(context: ExecutionContext): AuthRequest {
    return switchExec(context.getType<GqlContextType>(), {
      graphql: () => GqlExecutionContext.create(context).getContext().req,
      http: () => context.switchToHttp().getRequest(),
      ws: () => context.switchToWs().getClient().handshake,
      rpc: () => context.switchToRpc().getContext().req,
    });
  },
};
