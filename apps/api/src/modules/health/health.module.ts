import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaService } from "../../utils/prisma.service";
import { HealthController } from "./controllers/health.controller";
import { HealthService } from "./services/health.service";
import { PingService } from "./services/ping.service";

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [HealthController],
  providers: [HealthService, PingService, PrismaService],
})
export class HealthModule {}
