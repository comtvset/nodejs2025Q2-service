import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { CYAN, GRAY, RESET_COLOR, YELLOW } from './constants/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const port = process.env.PORT;
  await app.listen(port);
  console.log(`
        ${CYAN}
  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━►
  ┃ Server is running on port ${YELLOW}${port}${CYAN}
  ┃ ${GRAY}http://localhost:${port}${CYAN}
  ┗━━━━━━━━━━━━━━━━━━━━━━━━►
        ${RESET_COLOR}
        `);
}
bootstrap();
