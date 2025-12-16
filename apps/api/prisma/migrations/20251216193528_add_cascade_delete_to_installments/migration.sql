-- DropForeignKey
ALTER TABLE "public"."Installment" DROP CONSTRAINT "Installment_expenseId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Installment" ADD CONSTRAINT "Installment_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "public"."Expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;
