import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../../utils/prisma.service";

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async checkHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      this.logger.log("Health check executado com sucesso - API e banco OK");

      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: "connected",
        message: "API está funcionando e banco de dados conectado",
      };
    } catch (error) {
      this.logger.error("Erro no health check:", error);

      return {
        status: "error",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: "disconnected",
        message: "Erro na conexão com o banco de dados",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async ping() {
    this.logger.log("Ping executado - mantendo API ativa");

    return {
      status: "pong",
      timestamp: new Date().toISOString(),
      message: "API está ativa",
    };
  }
}
