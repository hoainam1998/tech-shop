import { Module } from '@nestjs/common';
import ProductService from './product.service';
import ProductController from './product.controller';

@Module({
  imports: [
    // ClientsModule.registerAsync([
    //   {
    //     useFactory: (configService: ConfigService): ClientProvider => {
    //       return {
    //         transport: Transport.TCP,
    //         options: {
    //           host: process.env.NODE_ENV === 'docker' ? 'host.docker.internal' : configService.get<string>('LOCALHOST'),
    //           port: parseInt(configService.get<string>('ports.PRODUCT_MICROSERVICE_TCP_PORT')!),
    //         },
    //       };
    //     },
    //     inject: [ConfigService],
    //     name: PRODUCT_SERVICE,
    //   },
    // ]),
  ],
  providers: [ProductService],
  controllers: [ProductController],
})
export default class ProductModule {}
