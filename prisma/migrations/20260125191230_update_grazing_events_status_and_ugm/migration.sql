-- AlterEnum: Update GrazingEventStatus enum values
-- Step 1: Create new enum type
CREATE TYPE "GrazingEventStatus_new" AS ENUM ('planned', 'active', 'done', 'canceled');

-- Step 2: Alter column to use text temporarily and update values
ALTER TABLE "grazing_events" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "grazing_events" ALTER COLUMN "status" TYPE text;
UPDATE "grazing_events" SET status = 'done' WHERE status = 'closed';

-- Step 3: Convert to new enum type
ALTER TABLE "grazing_events" ALTER COLUMN "status" TYPE "GrazingEventStatus_new" USING ("status"::"GrazingEventStatus_new");
ALTER TABLE "grazing_events" ALTER COLUMN "status" SET DEFAULT 'planned';

-- Step 4: Drop old enum and rename new one
DROP TYPE "GrazingEventStatus";
ALTER TYPE "GrazingEventStatus_new" RENAME TO "GrazingEventStatus";

-- AlterTable: Add ugm_snapshot column
ALTER TABLE "grazing_events" ADD COLUMN "ugm_snapshot" DECIMAL(10,4);

-- CreateIndex: Add index on status
CREATE INDEX "grazing_events_status_idx" ON "grazing_events"("status");
