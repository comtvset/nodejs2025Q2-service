import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

enum LogLevel {
  ERROR = 0,
  WARN = 1,
  LOG = 2,
  DEBUG = 3,
  VERBOSE = 4,
}

@Injectable()
export class LoggingService {
  private readonly logDir = path.join(__dirname, '../../logs');
  private readonly logFilePath = path.join(this.logDir, 'app.log');
  private readonly errorFile = path.join(this.logDir, 'error.log');
  private readonly maxFileSize =
    parseInt(process.env.LOG_FILE_SIZE_KB || '100') * 1024;

  private readonly logLevel = parseInt(process.env.LOG_LEVEL || '2', 10);

  constructor() {
    this.ensureLogDirectoryExists();
    if (!process.env.LOG_LEVEL) {
      this.warn('LOG_LEVEL is not set, using default level 2');
    }
    if (!process.env.LOG_FILE_SIZE_KB) {
      this.warn('LOG_FILE_SIZE_KB is not set, using default level 100KB');
    }
  }

  private ensureLogDirectoryExists() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private rotateFileIfNeeded(filePath: string) {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.size >= this.maxFileSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const archive = filePath.replace('.log', `-${timestamp}.log`);
        fs.renameSync(filePath, archive);
      }
    }
  }

  private writeToFile(level: string, message: string, isError = false) {
    const time = new Date().toISOString();
    const line = `[${time}] [${level}] ${message}\n`;

    this.rotateFileIfNeeded(this.logFilePath);
    fs.appendFileSync(this.logFilePath, line);

    if (isError) {
      this.rotateFileIfNeeded(this.errorFile);
      fs.appendFileSync(this.errorFile, line);
    }
  }

  private writeToConsole(level: string, message: string) {
    const time = new Date().toISOString();
    process.stdout.write(`[${time}] [${level}] ${message}\n`);
  }

  log(msg: string) {
    if (this.logLevel >= LogLevel.LOG) {
      this.writeToFile('LOG', msg);
      this.writeToConsole('LOG', msg);
    }
  }

  error(msg: string, trace?: string) {
    if (this.logLevel >= LogLevel.ERROR) {
      this.writeToFile('ERROR', `${msg}\n${trace || ''}`, true);
      this.writeToConsole('ERROR', `${msg}\n${trace || ''}`);
    }
  }

  warn(msg: string) {
    if (this.logLevel >= LogLevel.WARN) {
      this.writeToFile('WARN', msg);
      this.writeToConsole('WARN', msg);
    }
  }

  debug(msg: string) {
    if (this.logLevel >= LogLevel.DEBUG) {
      this.writeToFile('DEBUG', msg);
      this.writeToConsole('DEBUG', msg);
    }
  }

  verbose(msg: string) {
    if (this.logLevel >= LogLevel.VERBOSE) {
      this.writeToFile('VERBOSE', msg);
      this.writeToConsole('VERBOSE', msg);
    }
  }
}
