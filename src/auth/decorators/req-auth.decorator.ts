import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { unknownContextConvertor } from '../../shared/convertors/unknown-context.convertor';

export const ReqAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    unknownContextConvertor.toHttpRequest(ctx).user,
);
