import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class PingService {
  private readonly logger = new Logger(PingService.name);

  // Executa a cada 14 minutos
  @Cron("0 */14 * * * *")
  async handlePingCron() {
    try {
      this.logger.log("Executando ping automático para manter API ativa...");

      const baseUrl = process.env.BASE_URL || "http://localhost:3333";
      const response = await fetch(`${baseUrl}/health/ping`);

      if (response.ok) {
        const data = await response.json();
        this.logger.log(`Ping executado com sucesso: ${data.message}`);
      } else {
        this.logger.warn(`Ping retornou status ${response.status}`);
      }
    } catch (error) {
      this.logger.error("Erro ao executar ping automático:", error);
    }
  }

  // Método manual para testar o ping
  async executePing() {
    this.logger.log("Executando ping manual...");
    await this.handlePingCron();
    return { message: "Ping manual executado" };
  }
}
