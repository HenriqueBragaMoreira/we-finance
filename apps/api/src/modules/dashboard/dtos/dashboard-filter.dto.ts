import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class DashboardFilterDto {
  @ApiPropertyOptional({
    example: "user-uuid-123",
    description: "ID do usuário para filtrar dados específicos",
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    example: "janeiro,fevereiro,março",
    description: "Mês(es) para filtrar. Use vírgula para múltiplos meses",
  })
  @IsOptional()
  @IsString()
  month?: string;

  @ApiPropertyOptional({
    example: "2024,2025",
    description: "Ano(s) para filtrar. Use vírgula para múltiplos anos",
  })
  @IsOptional()
  @IsString()
  year?: string;
}
