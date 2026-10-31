import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import { GlobalValidatePipe } from '@share/pipes';
import { mainLog } from '@share/libs/logging/winston';
import HttpExceptionFilter from '@share/exception-filter/http-exception.filter';
import ENVService from '@share/environment-config/env-config.service';
import TimeoutInterceptor from '@share/interceptors/timeout.interceptor';
import TimeoutService from '@share/libs/timeout/timeout.service';
import AlsService from '@share/libs/als/als.service';
import AbortService from '@share/helpers/abort.service';
import ApiGatewayModule from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule, {
    logger: mainLog,
  });
  const config: ENVService = app.get(ENVService);
  const timeoutService: TimeoutService = app.get<TimeoutService>(TimeoutService);
  const abortService: AbortService = app.get<AbortService>(AbortService);
  const alsService: AlsService = app.get<AlsService>(AlsService);
  const port = config.Port.API_PORT || 5000;
  app.use(helmet());
  app.useGlobalInterceptors(new TimeoutInterceptor(timeoutService, alsService, abortService));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(GlobalValidatePipe.getInstance());
  await app.listen(port, () => Logger.log(`App started at ${port}`, 'App Bootstrap'));
}
void bootstrap();
