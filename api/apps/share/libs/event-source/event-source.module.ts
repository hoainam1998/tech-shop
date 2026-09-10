import { Module } from '@nestjs/common';
import { EventNestPostgreSQLModule, PostgreSQLModuleOptions } from '@event-nest/postgresql';
import { ForCountSnapshotStrategy } from '@event-nest/core';
import UserEventSourceService from './modules/user/user.service';
import ENVService from '@share/environment-config/env-config.service';
import CategoryEventSourceService from './modules/category/category.service';

@Module({
  imports: [
    EventNestPostgreSQLModule.registerAsync({
      useFactory: (envService: ENVService): PostgreSQLModuleOptions => {
        return {
          aggregatesTableName: envService.EventSource.AGGREGATES_TABLE_NAME,
          connectionUri: envService.EventSource.EVENT_SOURCE_DATABASE_URL,
          eventsTableName: envService.EventSource.EVENTS_TABLE_NAME,
          schemaName: envService.EventSource.SCHEMA_NAME,
          ensureTablesExist: false,
          snapshotTableName: envService.EventSource.SNAPSHOT_TABLE_NAME,
          snapshotStrategy: new ForCountSnapshotStrategy({ count: 1 }),
        };
      },
      inject: [ENVService],
    }),
  ],
  providers: [UserEventSourceService, CategoryEventSourceService],
  exports: [UserEventSourceService, CategoryEventSourceService],
})
export default class EventSourceModule {}
