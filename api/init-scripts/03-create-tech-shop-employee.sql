DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'tech_shop_employee') THEN
    CREATE USER tech_shop_employee WITH PASSWORD 'root';
  END IF;
END
$$;
GRANT CONNECT ON DATABASE "tech-shop" TO tech_shop_employee;
GRANT USAGE ON SCHEMA employee TO tech_shop_employee;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA employee TO tech_shop_employee;
ALTER DEFAULT PRIVILEGES IN SCHEMA employee GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO tech_shop_employee;
