# Type "important_file + Enter"
# This is file for building.
# Please don't modify it.

for file in init-scripts/*.sql; do
  echo "Executing $file..."
  npx prisma db execute --config prisma-config/prisma.tech-shop.config --file "$file"
done
