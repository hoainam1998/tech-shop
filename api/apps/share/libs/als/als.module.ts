import { Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import AlsService from './als.service';

@Module({
  providers: [
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
    AlsService,
  ],
  exports: [AlsService],
})
export default class AlsModule {}
