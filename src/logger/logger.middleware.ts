import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, body, query } = req;
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const log = `${method} ${url} ${res.statusCode} - ${duration}ms\nQuery: ${JSON.stringify(query, null, 2)}\nBody: ${JSON.stringify(body, null, 2)}`;
      this.logger.log(log);
    });

    next();
  }
}
