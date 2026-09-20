import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { pathJoin } from '@share/utils';
import ShareModule from '@share/share.module';
import { TenantMiddleware, XssMiddleware, IdempotencyMiddleware } from '@share/middlewares';
import HealthyRouter from '@share/router/healthy';
import StaticRouter from '@share/router/static';
import { IDEMPOTENCY_OPTION_NAME, RATE_LIMITING_OPTION_NAME, THROTTLER_OPTION_NAME } from '@share/enums';
import IdempotencyRegisterModule from '@share/libs/idempotency/idempotency.module';
import RateLimitingRegisterModule from '@share/libs/rate-limiting/rate-limiting.module';
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
    IdempotencyRegisterModule.forRoot([
      {
        name: IDEMPOTENCY_OPTION_NAME.MEDIUM,
        ttl: 50,
      },
      {
        name: IDEMPOTENCY_OPTION_NAME.SHORT,
        ttl: 20,
      },
    ]),
    RateLimitingRegisterModule.forRoot([
      {
        name: RATE_LIMITING_OPTION_NAME.MEDIUM,
        token: 4,
      },
      {
        name: RATE_LIMITING_OPTION_NAME.LESS,
        token: 1,
      },
    ]),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: THROTTLER_OPTION_NAME.SHORT,
          ttl: 1000,
          limit: 5,
        },
        {
          name: THROTTLER_OPTION_NAME.MEDIUM,
          ttl: 10 * 1000,
          limit: 20,
        },
        {
          name: THROTTLER_OPTION_NAME.LONG,
          ttl: 60 * 1000,
          limit: 100,
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export default class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware, IdempotencyMiddleware, XssMiddleware)
      .exclude(StaticRouter.WildCard, HealthyRouter.WildCard)
      .forRoutes('*');
  }
}
