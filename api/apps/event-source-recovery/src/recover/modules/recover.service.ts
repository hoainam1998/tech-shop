import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/event-source';
import { Prisma } from '@prisma/client';

@Injectable()
export default abstract class RecoverService {
  constructor(private eventSourcePgService: PrismaClient) {}

  protected abstract createRecord(data: unknown): Promise<void>;
  protected abstract updateRecord(data: unknown): Promise<void>;
  abstract recover(): Promise<void>;

  protected getAll(): Promise<any[]> {
    const query = Prisma.sql`
        SELECT DISTINCT
          T3.PAYLOAD,
          T3.AGGREGATE_ROOT_ID,
          T4.AGGREGATE_ROOT_NAME,
          T3.AGGREGATE_ROOT_VERSION
        FROM
          (
            SELECT
              T1.AGGREGATE_ROOT_VERSION,
              AGGREGATE_ROOT_ID,
              T1.PAYLOAD
            FROM
              EVENT_NEST_SCHEMA.SNAPSHOTS AS T1
            WHERE
              T1.AGGREGATE_ROOT_VERSION = (
                SELECT
                  MAX(T2.AGGREGATE_ROOT_VERSION)
                FROM
                  EVENT_NEST_SCHEMA.SNAPSHOTS AS T2
                WHERE
                  T1.AGGREGATE_ROOT_ID = T2.AGGREGATE_ROOT_ID
              )
          ) AS T3
        LEFT JOIN EVENT_NEST_SCHEMA.EVENTS AS T4 ON T4.AGGREGATE_ROOT_ID = T3.AGGREGATE_ROOT_ID;`;
    return this.eventSourcePgService.$queryRaw(query);
  }

  protected getByAggregateName(aggregateName: string): Promise<any[]> {
    const query = Prisma.sql`
        SELECT DISTINCT
          T3.PAYLOAD,
          T3.AGGREGATE_ROOT_ID,
          T4.AGGREGATE_ROOT_NAME,
          T3.AGGREGATE_ROOT_VERSION
        FROM
          (
            SELECT
              T1.AGGREGATE_ROOT_VERSION,
              AGGREGATE_ROOT_ID,
              T1.PAYLOAD
            FROM
              EVENT_NEST_SCHEMA.SNAPSHOTS AS T1
            WHERE
              T1.AGGREGATE_ROOT_VERSION = (
                SELECT
                  MAX(T2.AGGREGATE_ROOT_VERSION)
                FROM
                  EVENT_NEST_SCHEMA.SNAPSHOTS AS T2
                WHERE
                  T1.AGGREGATE_ROOT_ID = T2.AGGREGATE_ROOT_ID
              )
          ) AS T3
        LEFT JOIN EVENT_NEST_SCHEMA.EVENTS AS T4 ON T4.AGGREGATE_ROOT_ID = T3.AGGREGATE_ROOT_ID
        WHERE T4.AGGREGATE_ROOT_NAME = ${aggregateName}`;
    return this.eventSourcePgService.$queryRaw(query);
  }

  protected deleteByAggregateId(aggregateId: string): void {
    void this.eventSourcePgService.$transaction([
      this.eventSourcePgService.snapshots.deleteMany({
        where: {
          aggregate_root_id: aggregateId,
        },
      }),
      this.eventSourcePgService.events.deleteMany({
        where: {
          aggregate_root_id: aggregateId,
        },
      }),
      this.eventSourcePgService.aggregates.delete({
        where: {
          id: aggregateId,
        },
      }),
    ]);
  }
}
