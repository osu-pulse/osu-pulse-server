import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class LoggingExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LoggingExceptionFilter.name);

  constructor(private baseExceptionFilter: BaseExceptionFilter) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error(exception);

    if (host.getType() === 'http') {
      this.baseExceptionFilter.catch(exception, host);
    } else {
      throw exception;
    }
  }
}
