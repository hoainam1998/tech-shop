# Type "important_file + Enter"
# This is file for building.
# Please don't modify it.

npx prisma migrate deploy --schema prisma/tech-shop/schema.prisma --config prisma-config/prisma.tech-shop.config && npx prisma generate --schema prisma/tech-shop/schema.prisma --config prisma-config/prisma.tech-shop.config
npx prisma migrate deploy --schema prisma/event-source/schema.prisma --config prisma-config/prisma.event-source.config && npx prisma generate --schema prisma/event-source/schema.prisma --config prisma-config/prisma.event-source.config