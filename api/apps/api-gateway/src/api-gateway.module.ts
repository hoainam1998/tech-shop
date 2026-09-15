import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { pathJoin } from '@share/utils';
import ShareModule from '@share/share.module';
import { TenantMiddleware, XssMiddleware } from '@share/middlewares';
import HealthyRouter from '@share/router/healthy';
import StaticRouter from '@share/router/static';
import ProductModule from './product/product.module';
import CategoryModule from './category/category.module';
import HealthyModule from './healthy/healthy.module';

@Module({
  imports: [
    ShareModule,
    ProductModule,
    CategoryModule,
    HealthyModule,
    ServeStaticModule.forRoot({
      rootPath: pathJoin('assets'),
      serveRoot: StaticRouter.BaseUrl,
    }),
  ],
})
export default class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware, XssMiddleware)
      .exclude(StaticRouter.WildCard, HealthyRouter.WildCard)
      .forRoutes('*');
  }
}
