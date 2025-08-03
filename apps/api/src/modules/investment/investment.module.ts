import { Module } from "@nestjs/common";
import { PrismaService } from "@/utils/prisma.service";
import { InvestmentController } from "./controllers/investment.controller";
import { InvestmentRepository } from "./investment.repository";
import { InvestmentService } from "./services/investment.service";

@Module({
  controllers: [InvestmentController],
  providers: [InvestmentService, InvestmentRepository, PrismaService],
})
export class InvestmentModule {}
