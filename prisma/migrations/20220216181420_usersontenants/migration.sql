/*
  Warnings:

  - You are about to drop the column `userId` on the `Tenant` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "UsersOnTenants" (
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,

    PRIMARY KEY ("userId", "tenantId"),
    CONSTRAINT "UsersOnTenants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UsersOnTenants_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Tenant" ("createdAt", "id", "image", "name", "plan", "slug") SELECT "createdAt", "id", "image", "name", "plan", "slug" FROM "Tenant";
DROP TABLE "Tenant";
ALTER TABLE "new_Tenant" RENAME TO "Tenant";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
