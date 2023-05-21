-- CreateTable
CREATE TABLE "category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,
    "updated_at" DATETIME NOT NULL,
    "updated_by" INTEGER NOT NULL,
    "deleted_at" DATETIME,
    "deleted_by" INTEGER
);
