import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { unknownContextConvertor } from '../../shared/convertors/unknown-context.convertor';

export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) =>
    unknownContextConvertor.toHttpRequest(ctx).user,
);
