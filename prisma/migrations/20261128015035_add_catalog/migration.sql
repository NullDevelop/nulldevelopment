-- CreateTable
CREATE TABLE "catalog_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "baseHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "complexity" TEXT NOT NULL DEFAULT 'media',
    "monthlyFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyDuration" INTEGER NOT NULL DEFAULT 12,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "catalog_categories_name_key" ON "catalog_categories"("name");

-- CreateIndex
CREATE INDEX "catalog_items_categoryId_idx" ON "catalog_items"("categoryId");

-- AddForeignKey
ALTER TABLE "catalog_items" ADD CONSTRAINT "catalog_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "catalog_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
