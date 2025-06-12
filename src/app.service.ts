import { Injectable } from '@nestjs/common';
import { greetings } from './constants/greetings';
import { LoggingService } from './logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: LoggingService) {}
  getHello(): object {
    this.logger.log('Hello from log');
    return greetings;
  }
}
