/*
  Warnings:

  - A unique constraint covering the columns `[color]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `color` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Category_color_key" ON "public"."Category"("color");
