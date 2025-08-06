/*
  Warnings:

  - You are about to alter the column `destinationId` on the `EventLog` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `originId` on the `EventLog` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EventLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "originId" INTEGER NOT NULL,
    "destinationId" INTEGER,
    "amount" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_EventLog" ("amount", "createdAt", "destinationId", "id", "originId", "type") SELECT "amount", "createdAt", "destinationId", "id", "originId", "type" FROM "EventLog";
DROP TABLE "EventLog";
ALTER TABLE "new_EventLog" RENAME TO "EventLog";
CREATE INDEX "EventLog_createdAt_idx" ON "EventLog"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
