-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'privado';

-- Preserve the sector of the projects that already appear in the showcase
UPDATE "projects" SET "category" = 'saas' WHERE "slug" IN ('scopeflow', 'autosystem', 'narrativa-blog');
UPDATE "projects" SET "category" = 'landing' WHERE "slug" = 'rancho-capivari';
UPDATE "projects" SET "category" = 'governamental' WHERE "slug" IN ('footeasy', 'sira');
