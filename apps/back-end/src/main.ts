import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Servidor corriendo en el puerto: ${port}`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
