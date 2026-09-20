ALTER TABLE "Announcement"
ADD COLUMN "author" TEXT,
ADD COLUMN "category" TEXT,
ADD COLUMN "priority" TEXT;

UPDATE "Announcement"
SET
  "author" = 'Community Management',
  "category" = 'General',
  "priority" = 'Medium'
WHERE "author" IS NULL
   OR "category" IS NULL
   OR "priority" IS NULL;

ALTER TABLE "Announcement"
ALTER COLUMN "author" SET NOT NULL,
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "priority" SET NOT NULL;

ALTER TABLE "User"
ADD COLUMN "unitId" INTEGER;

ALTER TABLE "User"
ADD CONSTRAINT "User_unitId_fkey"
FOREIGN KEY ("unitId") REFERENCES "Unit"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;