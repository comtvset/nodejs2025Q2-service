import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService {
  private readonly logDir = path.join(__dirname, '../../logs');
  private readonly logFilePath = path.join(this.logDir, 'app.log');

  constructor() {
    this.ensureLogDirectoryExists();
  }

  private ensureLogDirectoryExists() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  log(message: string) {
    this.writeToFile('LOG', message);
  }

  private writeToFile(level: string, message: string) {
    try {
      const logLine = `[${new Date().toISOString()}] [${level}] ${message}\n`;
      fs.appendFileSync(this.logFilePath, logLine);
    } catch (error) {
      console.error('Failed to write log:', error);
    }
  }
}
