DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tech_shop_admin') THEN
    CREATE USER tech_shop_admin WITH PASSWORD 'root';
  END IF;
END
$$;
GRANT CONNECT ON DATABASE "tech-shop" TO tech_shop_admin;
GRANT USAGE ON SCHEMA admin TO tech_shop_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA admin TO tech_shop_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA admin GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO tech_shop_admin;
