import { CustomParamFactory } from '@nestjs/common/interfaces';
import { ReqAuth } from '../../../src/auth/decorators/req-auth.decorator';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import Mock = jest.Mock;

describe('Auth', () => {
  let getRequestMock: Mock;
  let contextMock: ExecutionContext;
  let factory: CustomParamFactory;

  beforeEach(() => {
    getRequestMock = jest.fn();

    class MockController {
      mockRequest(@ReqAuth() user) {}
    }
    const args = Reflect.getMetadata(
      ROUTE_ARGS_METADATA,
      MockController,
      'mockRequest',
    );
    factory = Object.values(args)[0]['factory'];

    contextMock = createMock<ExecutionContext>({
      getType: () => 'http',
      switchToHttp: () => ({
        getRequest: getRequestMock,
      }),
    });
  });

  it('should pick user', () => {
    getRequestMock.mockReturnValueOnce({
      user: { id: 'id' },
    });

    const result = factory(null, contextMock);

    expect(result).toStrictEqual({ id: 'id' });
  });
});
