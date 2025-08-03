import { Module } from "@nestjs/common";
import { PrismaService } from "@/utils/prisma.service";
import { ExpenseController } from "./controllers/expense.controller";
import { ExpenseRepository } from "./expense.repository";
import { ExpenseService } from "./services/expense.service";

@Module({
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseRepository, PrismaService],
})
export class ExpenseModule {}
