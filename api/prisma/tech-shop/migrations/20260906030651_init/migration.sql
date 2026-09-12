-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "admin";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "customer";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "employee";

-- CreateEnum
CREATE TYPE "customer"."Status" AS ENUM ('IN_STOCK', 'OLD', 'LESS');

-- CreateEnum
CREATE TYPE "admin"."Employee_position" AS ENUM ('OPERATOR', 'CLEANING_STAFF');

-- CreateEnum
CREATE TYPE "customer"."Employee_position" AS ENUM ('OPERATOR', 'CLEANING_STAFF');

-- CreateEnum
CREATE TYPE "employee"."Employee_position" AS ENUM ('OPERATOR', 'CLEANING_STAFF');

-- CreateEnum
CREATE TYPE "admin"."Leave_status" AS ENUM ('APPROVED', 'PENDING', 'NOT_APPROVED');

-- CreateEnum
CREATE TYPE "employee"."Leave_status" AS ENUM ('APPROVED', 'PENDING', 'NOT_APPROVED');

-- CreateTable
CREATE TABLE "customer"."category" (
    "category_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "customer"."brand" (
    "brand_id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("brand_id")
);

-- CreateTable
CREATE TABLE "customer"."product" (
    "product_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "status" "customer"."Status" NOT NULL DEFAULT 'IN_STOCK',
    "category_id" UUID NOT NULL,
    "brand_id" UUID NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "admin"."product" (
    "product_id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "admin"."user" (
    "user_id" UUID NOT NULL,
    "first_name" VARCHAR(200) NOT NULL,
    "last_name" VARCHAR(20) NOT NULL,
    "avatar" TEXT,
    "password" VARCHAR(100) NOT NULL,
    "sex" BOOLEAN NOT NULL DEFAULT true,
    "power" SMALLINT NOT NULL DEFAULT 0,
    "phone" VARCHAR(11) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "session_id" VARCHAR(100),
    "reset_password_token" TEXT,
    "api_key" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "employee"."user" (
    "user_id" UUID NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "customer"."user" (
    "user_id" UUID NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "admin"."warehouse" (
    "warehouse_id" UUID NOT NULL,
    "num" SMALLINT NOT NULL,
    "height" SMALLINT NOT NULL,
    "width" SMALLINT NOT NULL,
    "squares" SMALLINT NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 0,
    "valid" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "warehouse_pkey" PRIMARY KEY ("warehouse_id")
);

-- CreateTable
CREATE TABLE "customer"."warehouse" (
    "warehouse_id" UUID NOT NULL,
    "num" SMALLINT NOT NULL,
    "height" SMALLINT NOT NULL,
    "width" SMALLINT NOT NULL,
    "squares" SMALLINT NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "warehouse_pkey" PRIMARY KEY ("warehouse_id")
);

-- CreateTable
CREATE TABLE "employee"."warehouse" (
    "warehouse_id" UUID NOT NULL,
    "num" SMALLINT NOT NULL,

    CONSTRAINT "warehouse_pkey" PRIMARY KEY ("warehouse_id")
);

-- CreateTable
CREATE TABLE "customer"."customer" (
    "customer_id" UUID NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "avatar" TEXT,
    "password" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "reset_password_token" TEXT,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "admin"."customer" (
    "customer_id" UUID NOT NULL,
    "first_name" VARCHAR(200) NOT NULL,
    "last_name" VARCHAR(20) NOT NULL,
    "avatar" TEXT,
    "password" VARCHAR(100) NOT NULL,
    "sex" BOOLEAN NOT NULL DEFAULT true,
    "phone" VARCHAR(11) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "reset_password_token" TEXT,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "admin"."employee" (
    "employee_id" UUID NOT NULL,
    "first_name" VARCHAR(200) NOT NULL,
    "last_name" VARCHAR(20) NOT NULL,
    "position" "admin"."Employee_position" NOT NULL,
    "avatar" TEXT,
    "password" VARCHAR(100) NOT NULL,
    "sex" BOOLEAN NOT NULL DEFAULT true,
    "phone" VARCHAR(11) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "on_leave_start" VARCHAR(13) NOT NULL,
    "on_leave_end" VARCHAR(13) NOT NULL,
    "reset_password_token" TEXT,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "employee"."employee" (
    "employee_id" UUID NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "position" "employee"."Employee_position" NOT NULL,
    "avatar" TEXT,
    "password" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "on_leave_start" VARCHAR(13) NOT NULL,
    "on_leave_end" VARCHAR(13) NOT NULL,
    "reset_password_token" TEXT,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "customer"."employee" (
    "employee_id" UUID NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "position" "customer"."Employee_position" NOT NULL,
    "avatar" TEXT,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "on_leave_start" VARCHAR(13) NOT NULL,
    "on_leave_end" VARCHAR(13) NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("employee_id")
);

-- CreateTable
CREATE TABLE "admin"."warehouse_operator" (
    "warehouse_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,

    CONSTRAINT "warehouse_operator_pkey" PRIMARY KEY ("warehouse_id","employee_id")
);

-- CreateTable
CREATE TABLE "customer"."warehouse_operator" (
    "warehouse_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,

    CONSTRAINT "warehouse_operator_pkey" PRIMARY KEY ("warehouse_id","employee_id")
);

-- CreateTable
CREATE TABLE "admin"."customer_warehouse" (
    "customer_id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,

    CONSTRAINT "customer_warehouse_pkey" PRIMARY KEY ("customer_id","warehouse_id")
);

-- CreateTable
CREATE TABLE "customer"."customer_warehouse" (
    "customer_id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,

    CONSTRAINT "customer_warehouse_pkey" PRIMARY KEY ("customer_id","warehouse_id")
);

-- CreateTable
CREATE TABLE "admin"."product_import" (
    "id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "approver" UUID NOT NULL,
    "at" VARCHAR(13) NOT NULL,
    "amount_items" SMALLINT NOT NULL,

    CONSTRAINT "product_import_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin"."product_import_detail" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "amount" SMALLINT NOT NULL,

    CONSTRAINT "product_import_detail_pkey" PRIMARY KEY ("id","product_id")
);

-- CreateTable
CREATE TABLE "admin"."request_import_staff" (
    "request_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "work_start_time" VARCHAR(13) NOT NULL,
    "work_end_time" VARCHAR(13) NOT NULL,

    CONSTRAINT "request_import_staff_pkey" PRIMARY KEY ("request_id","employee_id")
);

-- CreateTable
CREATE TABLE "admin"."product_export" (
    "id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "approver" UUID NOT NULL,
    "at" VARCHAR(13) NOT NULL,
    "amount_items" SMALLINT NOT NULL,

    CONSTRAINT "product_export_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin"."product_export_detail" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "amount" SMALLINT NOT NULL,

    CONSTRAINT "product_export_detail_pkey" PRIMARY KEY ("id","product_id")
);

-- CreateTable
CREATE TABLE "admin"."request_export_staff" (
    "request_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "work_start_time" VARCHAR(13) NOT NULL,
    "work_end_time" VARCHAR(13) NOT NULL,

    CONSTRAINT "request_export_staff_pkey" PRIMARY KEY ("request_id","employee_id")
);

-- CreateTable
CREATE TABLE "admin"."product_relocate" (
    "id" UUID NOT NULL,
    "approver" UUID NOT NULL,
    "old_warehouse_id" UUID NOT NULL,
    "new_warehouse_id" UUID NOT NULL,
    "at" VARCHAR(13) NOT NULL,
    "amount_items" SMALLINT NOT NULL,

    CONSTRAINT "product_relocate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin"."product_relocate_detail" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "amount" SMALLINT NOT NULL,

    CONSTRAINT "product_relocate_detail_pkey" PRIMARY KEY ("id","product_id")
);

-- CreateTable
CREATE TABLE "admin"."request_relocate_staff" (
    "request_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "work_start_time" VARCHAR(13) NOT NULL,
    "work_end_time" VARCHAR(13) NOT NULL,

    CONSTRAINT "request_relocate_staff_pkey" PRIMARY KEY ("request_id","employee_id")
);

-- CreateTable
CREATE TABLE "admin"."request_employee_leave" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "approver" UUID NOT NULL,
    "status" "admin"."Leave_status" NOT NULL DEFAULT 'PENDING',
    "start" VARCHAR(13) NOT NULL,
    "end" VARCHAR(13) NOT NULL,

    CONSTRAINT "request_employee_leave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee"."request_employee_leave" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "approver" UUID NOT NULL,
    "status" "employee"."Leave_status" NOT NULL DEFAULT 'PENDING',
    "start" VARCHAR(13) NOT NULL,
    "end" VARCHAR(13) NOT NULL,

    CONSTRAINT "request_employee_leave_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_name_category_id_brand_id_idx" ON "customer"."product"("name", "category_id", "brand_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_password_key" ON "admin"."user"("password");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "admin"."user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "admin"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_session_id_key" ON "admin"."user"("session_id");

-- CreateIndex
CREATE INDEX "user_user_id_email_idx" ON "admin"."user"("user_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "customer_password_key" ON "customer"."customer"("password");

-- CreateIndex
CREATE UNIQUE INDEX "customer_phone_key" ON "customer"."customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "customer_email_key" ON "customer"."customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customer_reset_password_token_key" ON "customer"."customer"("reset_password_token");

-- CreateIndex
CREATE UNIQUE INDEX "customer_password_key" ON "admin"."customer"("password");

-- CreateIndex
CREATE UNIQUE INDEX "customer_phone_key" ON "admin"."customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "customer_email_key" ON "admin"."customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customer_reset_password_token_key" ON "admin"."customer"("reset_password_token");

-- CreateIndex
CREATE UNIQUE INDEX "employee_password_key" ON "admin"."employee"("password");

-- CreateIndex
CREATE UNIQUE INDEX "employee_phone_key" ON "admin"."employee"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "admin"."employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employee_reset_password_token_key" ON "admin"."employee"("reset_password_token");

-- CreateIndex
CREATE UNIQUE INDEX "employee_password_key" ON "employee"."employee"("password");

-- CreateIndex
CREATE UNIQUE INDEX "employee_phone_key" ON "employee"."employee"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "employee"."employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employee_reset_password_token_key" ON "employee"."employee"("reset_password_token");

-- AddForeignKey
ALTER TABLE "customer"."product" ADD CONSTRAINT "FK_CATEGORY" FOREIGN KEY ("category_id") REFERENCES "customer"."category"("category_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "customer"."product" ADD CONSTRAINT "FK_BRAND" FOREIGN KEY ("brand_id") REFERENCES "customer"."brand"("brand_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin"."warehouse_operator" ADD CONSTRAINT "FK_WAREHOUSE_OPERATOR_ADMIN" FOREIGN KEY ("warehouse_id") REFERENCES "admin"."warehouse"("warehouse_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."warehouse_operator" ADD CONSTRAINT "FK_EMPLOYEE_WAREHOUSE_OPERATOR_ADMIN" FOREIGN KEY ("employee_id") REFERENCES "admin"."employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer"."warehouse_operator" ADD CONSTRAINT "FK_WAREHOUSE_OPERATOR_CUSTOMER" FOREIGN KEY ("warehouse_id") REFERENCES "customer"."warehouse"("warehouse_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer"."warehouse_operator" ADD CONSTRAINT "FK_EMPLOYEE_WAREHOUSE_OPERATOR_CUSTOMER" FOREIGN KEY ("employee_id") REFERENCES "customer"."employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."customer_warehouse" ADD CONSTRAINT "FK_CUSTOMER_WAREHOUSE_CUSTOMER_ADMIN" FOREIGN KEY ("customer_id") REFERENCES "admin"."customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."customer_warehouse" ADD CONSTRAINT "FK_CUSTOMER_WAREHOUSE_WAREHOUSE_ADMIN" FOREIGN KEY ("warehouse_id") REFERENCES "admin"."warehouse"("warehouse_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer"."customer_warehouse" ADD CONSTRAINT "FK_CUSTOMER_WAREHOUSE_CUSTOMER" FOREIGN KEY ("customer_id") REFERENCES "customer"."customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer"."customer_warehouse" ADD CONSTRAINT "FK_CUSTOMER_WAREHOUSE_WAREHOUSE" FOREIGN KEY ("warehouse_id") REFERENCES "customer"."warehouse"("warehouse_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."product_import" ADD CONSTRAINT "FK_WAREHOUSE_PRODUCT_IMPORT" FOREIGN KEY ("warehouse_id") REFERENCES "admin"."warehouse"("warehouse_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."product_import" ADD CONSTRAINT "FK_USER_PRODUCT_IMPORT" FOREIGN KEY ("approver") REFERENCES "admin"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."product_import_detail" ADD CONSTRAINT "FK_PRODUCT_IMPORT" FOREIGN KEY ("id") REFERENCES "admin"."product_import"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."product_import_detail" ADD CONSTRAINT "FK_PRODUCT_IMPORT_DETAIL" FOREIGN KEY ("product_id") REFERENCES "admin"."product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."request_import_staff" ADD CONSTRAINT "FK_REQUEST_IMPORT_STAFF" FOREIGN KEY ("request_id") REFERENCES "admin"."product_import"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."request_import_staff" ADD CONSTRAINT "FK_EMPLOYEE_REQUEST_IMPORT" FOREIGN KEY ("employee_id") REFERENCES "admin"."employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."product_export" ADD CONSTRAINT "FK_WAREHOUSE_PRODUCT_EXPORT" FOREIGN KEY ("warehouse_id") REFERENCES "admin"."warehouse"("warehouse_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."product_export" ADD CONSTRAINT "FK_USER_PRODUCT_EXPORT" FOREIGN KEY ("approver") REFERENCES "admin"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."product_export_detail" ADD CONSTRAINT "FK_PRODUCT_EXPORT" FOREIGN KEY ("id") REFERENCES "admin"."product_export"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."product_export_detail" ADD CONSTRAINT "FK_PRODUCT_EXPORT_DETAIL" FOREIGN KEY ("product_id") REFERENCES "admin"."product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."request_export_staff" ADD CONSTRAINT "FK_REQUEST_EXPORT_STAFF" FOREIGN KEY ("request_id") REFERENCES "admin"."product_export"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."request_export_staff" ADD CONSTRAINT "FK_EMPLOYEE_REQUEST_EXPORT" FOREIGN KEY ("employee_id") REFERENCES "admin"."employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."product_relocate" ADD CONSTRAINT "FK_USER_PRODUCT_RELOCATE" FOREIGN KEY ("approver") REFERENCES "admin"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."product_relocate" ADD CONSTRAINT "FK_OLD_WAREHOUSE_PRODUCT_RELOCATE" FOREIGN KEY ("old_warehouse_id") REFERENCES "admin"."warehouse"("warehouse_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."product_relocate" ADD CONSTRAINT "FK_NEW_WAREHOUSE_PRODUCT_RELOCATE" FOREIGN KEY ("new_warehouse_id") REFERENCES "admin"."warehouse"("warehouse_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."product_relocate_detail" ADD CONSTRAINT "FK_PRODUCT_RELOCATE" FOREIGN KEY ("id") REFERENCES "admin"."product_relocate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."product_relocate_detail" ADD CONSTRAINT "FK_PRODUCT_RELOCATE_DETAIL" FOREIGN KEY ("product_id") REFERENCES "admin"."product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."request_relocate_staff" ADD CONSTRAINT "FK_REQUEST_RELOCATE_STAFF" FOREIGN KEY ("request_id") REFERENCES "admin"."product_relocate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."request_relocate_staff" ADD CONSTRAINT "FK_EMPLOYEE_REQUEST_LOCATE" FOREIGN KEY ("employee_id") REFERENCES "admin"."employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."request_employee_leave" ADD CONSTRAINT "FK_EMPLOYEE_LEAVE_ADMIN" FOREIGN KEY ("employee_id") REFERENCES "admin"."employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin"."request_employee_leave" ADD CONSTRAINT "FK_ADMIN_EMPLOYEE_LEAVE_EMPLOYEE" FOREIGN KEY ("approver") REFERENCES "admin"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee"."request_employee_leave" ADD CONSTRAINT "FK_EMPLOYEE_LEAVE_EMPLOYEE" FOREIGN KEY ("employee_id") REFERENCES "employee"."employee"("employee_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee"."request_employee_leave" ADD CONSTRAINT "FK_USER_EMPLOYEE_LEAVE_EMPLOYEE" FOREIGN KEY ("approver") REFERENCES "employee"."user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
