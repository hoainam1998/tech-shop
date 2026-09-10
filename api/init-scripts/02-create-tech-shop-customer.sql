DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tech_shop_customer') THEN
    CREATE USER tech_shop_customer WITH PASSWORD 'root';
  END IF;
END
$$;
GRANT CONNECT ON DATABASE "tech-shop" TO tech_shop_customer;
GRANT USAGE ON SCHEMA customer TO tech_shop_customer;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA customer TO tech_shop_customer;
ALTER DEFAULT PRIVILEGES IN SCHEMA customer GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO tech_shop_customer;
