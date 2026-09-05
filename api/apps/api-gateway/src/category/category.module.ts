import { Module } from '@nestjs/common';
import { ClientProvider, ClientsModule, Transport } from '@nestjs/microservices';
import CategoryService from './category.service';
import CategoryController from './category.controller';
import { CATEGORY_SERVICE } from '@share/di-token';
import ENVService from '@share/environment-config/env-config.service';
import TenantNameService from '@share/helpers/tenant-name.service';
import MailModule from '@share/libs/mailer/mailer.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        useFactory: (envService: ENVService): ClientProvider => {
          return {
            transport: Transport.TCP,
            options: {
              host: envService.NodeENV === 'docker' ? 'host.docker.internal' : envService.Localhost,
              port: envService.Port.CATEGORY_MICROSERVICE_TCP_PORT,
            },
          };
        },
        inject: [ENVService],
        name: CATEGORY_SERVICE,
      },
    ]),
    MailModule,
  ],
  providers: [CategoryService, TenantNameService],
  controllers: [CategoryController],
})
export default class CategoryModule {}
