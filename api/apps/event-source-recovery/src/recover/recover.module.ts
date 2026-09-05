import { Module } from '@nestjs/common';
import CategoryRecoverService from './modules/category.service';
import RecoverService from './recover.service';
import PgDatabaseModule from '../postgres.module';

@Module({
  imports: [PgDatabaseModule],
  providers: [CategoryRecoverService, RecoverService],
  exports: [RecoverService],
})
export default class RecoverModule {}
