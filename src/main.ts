import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('main.ts');

  // creating microservice
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: envs.NATS_SERVERS,
    }
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen();
  logger.log(`Products microservice is listening on port: ${envs.PORT}`);
  logger.log(`NATS server(s) available: [${envs.NATS_SERVERS}]`);
}
bootstrap();
