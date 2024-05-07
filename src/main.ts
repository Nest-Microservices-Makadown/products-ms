import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('main.ts');  
  
  // creating microservice
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      port: envs.PORT,
      url: envs.DATABASE_URL,
    }
  })

  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
    );
  
  logger.log(`Products microservice is running on port: ${envs.PORT}`);
}
bootstrap();
