import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: '../prisma/event-source/schema.prisma',
  migrations: {
    path: '../prisma/event-source/migrations',
  },
  datasource: {
    url: env('EVENT_SOURCE_DATABASE_URL'),
  },
});
