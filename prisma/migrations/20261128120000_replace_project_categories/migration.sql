-- Unify the portfolio into three sectors: public, private and personal.
UPDATE "projects" SET "category" = 'pessoal' WHERE "category" = 'saas';
UPDATE "projects" SET "category" = 'privado' WHERE "category" = 'landing';
