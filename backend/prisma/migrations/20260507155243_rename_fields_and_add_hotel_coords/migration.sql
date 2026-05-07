/*
  Warnings:

  - You are about to drop the column `kind` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `palette` on the `Settings` table. All the data in the column will be lost.
  - Added the required column `view` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorPalette` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "mapZoom" INTEGER;

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "kind",
ADD COLUMN     "view" "ModuleKind" NOT NULL;

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "palette",
ADD COLUMN     "colorPalette" TEXT NOT NULL;
