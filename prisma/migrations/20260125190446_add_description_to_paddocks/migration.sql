-- AlterTable
ALTER TABLE "farms" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "paddocks" ADD COLUMN     "description" TEXT;
