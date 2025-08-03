/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `Income` table. All the data in the column will be lost.
  - Added the required column `paymentMethodId` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethodId` to the `Income` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethodId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Income" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethodId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_name_key" ON "PaymentMethod"("name");

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
