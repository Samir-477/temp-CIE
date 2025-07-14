/*
  Warnings:

  - The values [PROFESSOR] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `professor_id` on the `attendance_records` table. All the data in the column will be lost.
  - You are about to drop the column `professor_id` on the `class_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `professor_id` on the `library_requests` table. All the data in the column will be lost.
  - You are about to drop the column `professor_id` on the `location_bookings` table. All the data in the column will be lost.
  - You are about to drop the `professors` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'FACULTY', 'STUDENT');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "attendance_records" DROP CONSTRAINT "attendance_records_professor_id_fkey";

-- DropForeignKey
ALTER TABLE "class_schedules" DROP CONSTRAINT "class_schedules_professor_id_fkey";

-- DropForeignKey
ALTER TABLE "library_requests" DROP CONSTRAINT "library_requests_professor_id_fkey";

-- DropForeignKey
ALTER TABLE "location_bookings" DROP CONSTRAINT "location_bookings_professor_id_fkey";

-- DropForeignKey
ALTER TABLE "professors" DROP CONSTRAINT "professors_user_id_fkey";

-- AlterTable
ALTER TABLE "attendance_records" DROP COLUMN "professor_id";

-- AlterTable
ALTER TABLE "class_schedules" DROP COLUMN "professor_id";

-- AlterTable
ALTER TABLE "library_requests" DROP COLUMN "professor_id";

-- AlterTable
ALTER TABLE "location_bookings" DROP COLUMN "professor_id";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image_path" TEXT;

-- DropTable
DROP TABLE "professors";

-- CreateTable
CREATE TABLE "InternshipProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "skills" TEXT[],
    "facultyId" TEXT NOT NULL,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "slots" INTEGER,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternshipProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "internshipId" TEXT NOT NULL,
    "resumeUrl" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InternshipProject_facultyId_idx" ON "InternshipProject"("facultyId");

-- CreateIndex
CREATE INDEX "Application_studentId_idx" ON "Application"("studentId");

-- CreateIndex
CREATE INDEX "Application_internshipId_idx" ON "Application"("internshipId");

-- AddForeignKey
ALTER TABLE "InternshipProject" ADD CONSTRAINT "InternshipProject_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "InternshipProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
