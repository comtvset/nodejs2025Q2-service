import { Injectable } from '@nestjs/common';
import { greetings } from './constants/greetings';

@Injectable()
export class AppService {
  getHello(): object {
    return greetings;
  }
}
