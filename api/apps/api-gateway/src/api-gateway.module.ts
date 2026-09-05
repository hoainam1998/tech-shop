import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { pathJoin } from '@share/utils';
import ShareModule from '@share/share.module';
import { TenantMiddleware, XssMiddleware } from '@share/middlewares';
import ProductModule from './product/product.module';
import CategoryModule from './category/category.module';

@Module({
  imports: [
    ShareModule,
    ProductModule,
    CategoryModule,
    ServeStaticModule.forRoot({
      rootPath: pathJoin('assets'),
      serveRoot: '/static',
    }),
  ],
})
export default class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware, XssMiddleware).exclude('static/{*splat}').forRoutes('*');
  }
}
