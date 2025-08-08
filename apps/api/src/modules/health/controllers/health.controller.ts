import { Controller, Get } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { HealthService } from "../services/health.service";
import { PingService } from "../services/ping.service";

@ApiExcludeController()
@Controller("health")
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly pingService: PingService
  ) {}

  @Get()
  async checkHealth() {
    return this.healthService.checkHealth();
  }

  @Get("ping")
  async ping() {
    return this.healthService.ping();
  }

  @Get("test-cron")
  async testCron() {
    return this.pingService.executePing();
  }
}
