import { NestFactory } from '@nestjs/core';
import { AsyncOptions, MicroserviceOptions, Transport } from '@nestjs/microservices';
import ENVService from '@share/environment-config/env-config.service';
import CategoryModule from './category.module';
import RpcTimeoutInterceptor from '@share/interceptors/rpc-timeout.interceptor';
import RpcExceptionsFilter from '@share/exception-filter/rpc-exception.filter';
import AlsService from '@share/libs/als/als.service';
import AbortService from '@share/helpers/abort.service';

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
  const alsService: AlsService = app.get<AlsService>(AlsService);
  const abortService: AbortService = app.get<AbortService>(AbortService);
  app.useGlobalInterceptors(new RpcTimeoutInterceptor(alsService, abortService));
  app.useGlobalFilters(new RpcExceptionsFilter());
  await app.listen();
}
void bootstrap();
