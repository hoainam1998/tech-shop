import { NestFactory } from '@nestjs/core';
import { AsyncOptions, MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import ProductModule from './product.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncOptions<MicroserviceOptions>>(ProductModule, {
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: parseInt(configService.get<string>('ports.PRODUCT_MICROSERVICE_TCP_PORT')!),
      },
    }),
  });
  await app.listen();
}
void bootstrap();
