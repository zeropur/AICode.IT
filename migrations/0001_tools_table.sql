CREATE TABLE IF NOT EXISTS "tools" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "link" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "description" TEXT NOT NULL,
  "release_date" TIMESTAMP NOT NULL,
  "image_url" TEXT NOT NULL
); 