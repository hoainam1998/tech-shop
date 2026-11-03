ALTER TABLE "customer"."product" ADD CONSTRAINT product_customer_price CHECK (price >= 1000);

ALTER TABLE "admin"."user" ADD CONSTRAINT user_admin_email CHECK (email ~* $$^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\\-]*\.)+[A-Z]{2,}$$);

ALTER TABLE "customer"."customer" ADD CONSTRAINT customer_customer_email CHECK (email ~* $$^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\\-]*\.)+[A-Z]{2,}$$);

ALTER TABLE "admin"."customer" ADD CONSTRAINT customer_admin_email CHECK (email ~* $$^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\\-]*\.)+[A-Z]{2,}$$);

ALTER TABLE "admin"."employee" ADD CONSTRAINT employee_admin_email CHECK (email ~* $$^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\\-]*\.)+[A-Z]{2,}$$);

ALTER TABLE "employee"."employee" ADD CONSTRAINT employee_employee_email CHECK (email ~* $$^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\\-]*\.)+[A-Z]{2,}$$);

ALTER TABLE "admin"."user" ADD CONSTRAINT user_admin_phone CHECK (phone ~* '^0[1-9][0-9]{8,9}$');

ALTER TABLE "customer"."customer" ADD CONSTRAINT customer_customer_phone CHECK (phone ~* '^0[1-9][0-9]{8,9}$');

ALTER TABLE "admin"."customer" ADD CONSTRAINT customer_admin_phone CHECK (phone ~* '^0[1-9][0-9]{8,9}$');

ALTER TABLE "admin"."employee" ADD CONSTRAINT employee_admin_phone CHECK (phone ~* '^0[1-9][0-9]{8,9}$');

ALTER TABLE "employee"."employee" ADD CONSTRAINT employee_employee_phone CHECK (phone ~* '^0[1-9][0-9]{8,9}$');