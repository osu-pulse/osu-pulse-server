import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { unknownContextConvertor } from '../../../src/shared/convertors/unknown-context.convertor';

describe('unknownContextConvertor', () => {
  let requestMock: { headers: { field: string } };

  beforeEach(() => {
    requestMock = { headers: { field: 'string' } };
  });

  describe('toHttpRequest', () => {
    let graphqlContextMock: ExecutionContext;

    beforeEach(() => {
      graphqlContextMock = createMock<ExecutionContext>({
        getType: () => 'graphql',
        getArgs: () => [
          null,
          { req: requestMock as any },
          { req: requestMock as any },
        ],
      });
    });

    it('should transform graphql context', () => {
      const result = unknownContextConvertor.toHttpRequest(graphqlContextMock);

      expect(result).toStrictEqual(requestMock);
    });
  });

  describe('toHttpRequest', () => {
    let httpContextMock: ExecutionContext;

    beforeEach(() => {
      httpContextMock = createMock<ExecutionContext>({
        getType: () => 'http',
        switchToHttp: () => ({
          getRequest: () => requestMock,
        }),
      });
    });

    it('should transform http context', () => {
      const result = unknownContextConvertor.toHttpRequest(httpContextMock);

      expect(result).toStrictEqual(requestMock);
    });
  });

  describe('toHttpRequest', () => {
    let wsContextMock: ExecutionContext;

    beforeEach(() => {
      wsContextMock = createMock<ExecutionContext>({
        getType: () => 'ws',
        switchToWs: () => ({
          getClient: () => ({ handshake: requestMock }),
        }),
      });
    });

    it('should transform ws context', () => {
      const result = unknownContextConvertor.toHttpRequest(wsContextMock);

      expect(result).toStrictEqual(requestMock);
    });
  });

  describe('toHttpRequest', () => {
    let rpcContextMock: ExecutionContext;

    beforeEach(() => {
      rpcContextMock = createMock<ExecutionContext>({
        getType: () => 'rpc',
        switchToRpc: () => ({
          getContext: () => ({ req: requestMock }),
        }),
      });
    });

    it('should transform rpc context', () => {
      const result = unknownContextConvertor.toHttpRequest(rpcContextMock);

      expect(result).toStrictEqual(requestMock);
    });
  });
});
