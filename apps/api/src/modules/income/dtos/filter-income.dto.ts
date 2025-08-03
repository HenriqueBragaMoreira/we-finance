import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

enum IncomeStatus {
  PENDING = "PENDING",
  RECEIVED = "RECEIVED",
}

export class FilterIncomeDto {
  @ApiPropertyOptional({
    example: "Salário",
    description: "Filtrar por descrição",
  })
  description?: string;

  @ApiPropertyOptional({
    example: "Salário,Vendas",
    description:
      "Filtrar por nome da categoria. Use vírgula para múltiplas categorias",
  })
  category?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({
    example: "PIX",
    description: "Filtrar por método de pagamento",
  })
  paymentMethod?: string;

  @ApiPropertyOptional({ example: "RECEIVED", enum: ["RECEIVED", "PENDING"] })
  status?: IncomeStatus;

  @ApiPropertyOptional({
    example: "2025-07-01",
    description: "Data da receita (formato YYYY-MM-DD)",
  })
  date?: string;

  @ApiPropertyOptional({
    example: "user-uuid",
    description: "ID do usuário dono da receita",
  })
  userId?: string;

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
