import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: '../prisma/tech-shop/schema.prisma',
  migrations: {
    path: '../prisma/tech-shop/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
