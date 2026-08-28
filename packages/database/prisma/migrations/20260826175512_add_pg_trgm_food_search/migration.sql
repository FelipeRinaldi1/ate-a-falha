-- CreateExtension
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "food_name_trgm_idx" ON "Food" USING gin ("name" gin_trgm_ops);

-- CreateIndex on Exercise
CREATE INDEX IF NOT EXISTS "exercise_name_trgm_idx" ON "Exercise" USING gin ("name" gin_trgm_ops);
