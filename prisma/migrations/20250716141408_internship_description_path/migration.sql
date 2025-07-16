/*
  Warnings:

  - You are about to drop the column `description` on the `InternshipProject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InternshipProject" DROP COLUMN "description",
ADD COLUMN     "description_path" TEXT;
