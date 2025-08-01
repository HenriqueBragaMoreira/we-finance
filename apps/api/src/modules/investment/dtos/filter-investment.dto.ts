import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class FilterInvestmentDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({
    example: "2025-07-01",
    description: "Data do investimento (formato YYYY-MM-DD)",
  })
  investedAt?: string;

  @ApiPropertyOptional({
    example: "Ações da Petrobras",
    description: "Filtrar por nome do investimento",
  })
  notes?: string;

  @ApiPropertyOptional({
    example: "user-uuid",
    description: "ID do usuário dono do investimento",
  })
  userId?: string;

  @ApiPropertyOptional({
    example: "category-uuid",
    description: "ID da categoria do investimento",
  })
  categoryId?: string;

  @ApiPropertyOptional({
    example: "0",
    description: "Número da página",
  })
  init?: string;

  @ApiPropertyOptional({
    example: "10",
    description: "Número máximo de registros (paginação)",
  })
  limit?: string;
}
