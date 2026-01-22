-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('owner', 'admin', 'advisor', 'operator', 'viewer');

-- CreateEnum
CREATE TYPE "GrazingEventStatus" AS ENUM ('planned', 'active', 'closed');

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'viewer',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farms" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "center" geometry,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "farms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paddocks" (
    "id" UUID NOT NULL,
    "farm_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "polygon" geometry NOT NULL,
    "area_ha" DECIMAL(65,30),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "paddocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "water_points" (
    "id" UUID NOT NULL,
    "farm_id" UUID NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "location" geometry NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "water_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "herd_groups" (
    "id" UUID NOT NULL,
    "farm_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "headcount" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "herd_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grazing_events" (
    "id" UUID NOT NULL,
    "farm_id" UUID NOT NULL,
    "herd_group_id" UUID NOT NULL,
    "paddock_id" UUID NOT NULL,
    "status" "GrazingEventStatus" NOT NULL DEFAULT 'planned',
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "grazing_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "memberships_org_idx" ON "memberships"("organization_id");

-- CreateIndex
CREATE INDEX "memberships_user_idx" ON "memberships"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_org_user_unique" ON "memberships"("organization_id", "user_id");

-- CreateIndex
CREATE INDEX "farms_org_idx" ON "farms"("organization_id");

-- CreateIndex
CREATE INDEX "paddocks_farm_idx" ON "paddocks"("farm_id");

-- CreateIndex
CREATE INDEX "water_points_farm_idx" ON "water_points"("farm_id");

-- CreateIndex
CREATE INDEX "herd_groups_farm_idx" ON "herd_groups"("farm_id");

-- CreateIndex
CREATE INDEX "grazing_events_farm_idx" ON "grazing_events"("farm_id");

-- CreateIndex
CREATE INDEX "grazing_events_herd_idx" ON "grazing_events"("herd_group_id");

-- CreateIndex
CREATE INDEX "grazing_events_paddock_idx" ON "grazing_events"("paddock_id");

-- CreateIndex
CREATE INDEX "grazing_events_start_at_idx" ON "grazing_events"("start_at");

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "farms" ADD CONSTRAINT "farms_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paddocks" ADD CONSTRAINT "paddocks_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "water_points" ADD CONSTRAINT "water_points_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "herd_groups" ADD CONSTRAINT "herd_groups_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grazing_events" ADD CONSTRAINT "grazing_events_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grazing_events" ADD CONSTRAINT "grazing_events_herd_group_id_fkey" FOREIGN KEY ("herd_group_id") REFERENCES "herd_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grazing_events" ADD CONSTRAINT "grazing_events_paddock_id_fkey" FOREIGN KEY ("paddock_id") REFERENCES "paddocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
