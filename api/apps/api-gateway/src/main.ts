import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import { mainLog } from '@share/libs/logging/winston';
import ApiGatewayModule from './api-gateway.module';
import { HttpExceptionFilter } from '@share/exception-filter';
import ENVService from '@share/environment-config/env-config.service';
import { GlobalValidatePipe } from '@share/pipes';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule, {
    logger: mainLog,
  });
  const config: ENVService = app.get(ENVService);
  const port = config.Port.API_PORT || 5000;
  app.use(helmet());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(GlobalValidatePipe.getInstance());
  await app.listen(port, () => Logger.log(`App started at ${port}`, 'App Bootstrap'));
}
void bootstrap();
