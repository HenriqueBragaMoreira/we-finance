import { Module } from "@nestjs/common";
import { PrismaService } from "@/utils/prisma.service";
import { IncomeController } from "./controllers/income.controller";
import { IncomeRepository } from "./income.repository";
import { IncomeService } from "./services/income.service";

@Module({
  controllers: [IncomeController],
  providers: [IncomeService, IncomeRepository, PrismaService],
})
export class IncomeModule {}
