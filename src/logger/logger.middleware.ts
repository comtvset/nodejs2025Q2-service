import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // const { method, url, body, query } = req;
    const { method, url } = req;
    const start = Date.now();

    res.on('finish', () => {
      // const duration = Date.now() - start;
      // const log = `${method} ${url} ${res.statusCode} - ${duration}ms\nQuery: ${JSON.stringify(query, null, 2)}\nBody: ${JSON.stringify(body, null, 2)}`;
      // this.logger.log(log);
      const duration = Date.now() - start;
      const statusCode = res.statusCode;

      let log = `${method} ${url} ${statusCode} - ${duration}ms`;

      if (Object.keys(req.query).length) {
        log += `\nQuery: ${JSON.stringify(req.query, null, 2)}`;
      }

      if (req.body && Object.keys(req.body).length) {
        log += `\nBody: ${JSON.stringify(req.body, null, 2)}`;
      }

      this.logger.log(log);
    });

    next();
  }
}
