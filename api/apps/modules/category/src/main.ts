import { NestFactory } from '@nestjs/core';
import { AsyncOptions, MicroserviceOptions, Transport } from '@nestjs/microservices';
import CategoryModule from './category.module';
import ENVService from '@share/environment-config/env-config.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncOptions<MicroserviceOptions>>(CategoryModule, {
    inject: [ENVService],
    useFactory: (envService: ENVService) => {
      return {
        transport: Transport.TCP,
        options: {
          host: '0.0.0.0',
          port: envService.Port.CATEGORY_MICROSERVICE_TCP_PORT,
        },
      };
    },
  });
  await app.listen();
}
void bootstrap();
