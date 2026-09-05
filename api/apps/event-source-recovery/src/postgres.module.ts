import { Module } from '@nestjs/common';
import ShareModule from '@share/share.module';
import { techShopPgProvider, eventSourcePgProvider } from '@share/providers';

@Module({
  imports: [ShareModule],
  providers: [techShopPgProvider, eventSourcePgProvider],
  exports: [techShopPgProvider, eventSourcePgProvider],
})
export default class PgDatabaseModule {}
