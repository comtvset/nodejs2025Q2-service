import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from './logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const response = isHttp ? exception.getResponse() : null;

    const message =
      response && typeof response === 'object' && 'message' in response
        ? (response as any).message
        : isHttp
          ? exception.message
          : 'Internal Server Error';

    const stack = exception instanceof Error ? exception.stack : '';

    this.logger.error(
      `Error on ${req.method} ${req.url}: ${JSON.stringify(message)}`,
      stack,
    );

    res.status(status).json({
      statusCode: status,
      message,
      error:
        isHttp && typeof response === 'object' && 'error' in response
          ? (response as any).error
          : 'Internal Server Error',
    });
  }
}
