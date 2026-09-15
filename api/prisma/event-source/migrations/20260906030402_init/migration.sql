-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('INFO', 'WARN', 'ERROR');

-- CreateTable
CREATE TABLE "aggregates" (
    "id" UUID NOT NULL,
    "version" INTEGER NOT NULL,

    CONSTRAINT "aggregates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "aggregate_root_id" UUID NOT NULL,
    "aggregate_root_version" INTEGER NOT NULL,
    "aggregate_root_name" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "snapshots" (
    "id" UUID NOT NULL,
    "aggregate_root_id" UUID NOT NULL,
    "aggregate_root_version" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "revision" INTEGER NOT NULL,

    CONSTRAINT "snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log" (
    "id" UUID NOT NULL,
    "type" "LogType" NOT NULL,
    "user_requested" JSONB,
    "payload" JSONB NOT NULL,
    "context" VARCHAR(200) NOT NULL,
    "file" TEXT NOT NULL,
    "func" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_aggregate_root_id_foreign" FOREIGN KEY ("aggregate_root_id") REFERENCES "aggregates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "snapshots" ADD CONSTRAINT "snapshots_aggregate_root_id_foreign" FOREIGN KEY ("aggregate_root_id") REFERENCES "aggregates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
