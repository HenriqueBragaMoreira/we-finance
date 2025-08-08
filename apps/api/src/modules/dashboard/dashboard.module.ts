import { Module } from "@nestjs/common";
import { PrismaService } from "@/utils/prisma.service";
import { DashboardController } from "./controllers/dashboard.controller";
import { DashboardRepository } from "./dashboard.repository";
import { DashboardService } from "./services/dashboard.service";

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository, PrismaService],
})
export class DashboardModule {}
