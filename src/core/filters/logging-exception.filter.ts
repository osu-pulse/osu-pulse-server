import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { GqlContextType } from '@nestjs/graphql';

@Catch(HttpException, WsException)
export class LoggingExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LoggingExceptionFilter.name);

  constructor(private baseExceptionFilter: BaseExceptionFilter) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error(exception);

    if (host.getType<GqlContextType>() === 'graphql') {
      throw exception;
    }

    this.baseExceptionFilter.catch(exception, host);
  }
}
