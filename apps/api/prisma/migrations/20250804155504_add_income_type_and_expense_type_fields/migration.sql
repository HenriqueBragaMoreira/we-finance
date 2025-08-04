/*
  Warnings:

  - Added the required column `expenseType` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incomeType` to the `Income` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IncomeType" AS ENUM ('FIXED', 'VARIABLE');

-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('FIXED', 'VARIABLE');

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "expenseType" "ExpenseType" NOT NULL;

-- AlterTable
ALTER TABLE "Income" ADD COLUMN     "incomeType" "IncomeType" NOT NULL;
