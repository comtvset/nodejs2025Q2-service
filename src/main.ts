import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { CYAN, GRAY, RESET_COLOR, YELLOW } from './constants/constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { AllExceptionsFilter } from './logger/all-exceptions.filter';
import { LoggingService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new AllExceptionsFilter(app.get(LoggingService)));

  const logger = app.get(LoggingService);

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`, err.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any) => {
    const message =
      reason instanceof Error ? reason.message : JSON.stringify(reason);
    const stack = reason instanceof Error ? reason.stack : '';
    logger.error(`Unhandled Rejection: ${message}`, stack);
  });

  const config = new DocumentBuilder()
    .setTitle('REST Service')
    .setDescription('Home Library Service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const yamlStr = yaml.dump(document);
  fs.writeFileSync('./doc/api.yaml', yamlStr, 'utf8');

  SwaggerModule.setup('doc', app, document);

  const port = process.env.PORT;
  await app.listen(port);
  console.log(`
          ${CYAN}
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━►
    ┃ Server is running on port ${YELLOW}${port}${CYAN}
    ┃ ${GRAY}http://localhost:${port}${CYAN}
    ┃
    ┃ Swagger docs available at:
    ┃ ${GRAY}http://localhost:${port}/doc${CYAN}
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━►
          ${RESET_COLOR}
          `);
}
bootstrap();
