import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Matches } from "class-validator";

export class MonthlyStatsDto {
  @ApiPropertyOptional({
    example: "2025-08",
    description:
      "Mês para filtrar no formato YYYY-MM. Se não informado, usa o mês atual",
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, {
    message: "Month must be in format YYYY-MM (e.g., 2025-08)",
  })
  month?: string;
}

export interface MonthlyStatsResponseDto {
  totalExpenses: number;
  paid: number;
  pending: number;
  month: string;
}
