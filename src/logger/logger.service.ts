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

  log(msg: string) {
    if (this.logLevel >= LogLevel.LOG) this.writeToFile('LOG', msg);
  }

  error(msg: string, trace?: string) {
    if (this.logLevel >= LogLevel.ERROR) {
      this.writeToFile('ERROR', `${msg}\n${trace || ''}`, true);
    }
  }

  warn(msg: string) {
    if (this.logLevel >= LogLevel.WARN) this.writeToFile('WARN', msg);
  }

  debug(msg: string) {
    if (this.logLevel >= LogLevel.DEBUG) this.writeToFile('DEBUG', msg);
  }

  verbose(msg: string) {
    if (this.logLevel >= LogLevel.VERBOSE) this.writeToFile('VERBOSE', msg);
  }
}
