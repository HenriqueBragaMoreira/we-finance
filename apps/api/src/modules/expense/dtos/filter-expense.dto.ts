import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

enum ExpenseStatus {
  PENDING = "PENDING",
  PAID = "PAID",
}

enum ExpenseType {
  FIXED = "FIXED",
  VARIABLE = "VARIABLE",
}

export class FilterExpenseDto {
  @ApiPropertyOptional({
    example: "Conta de Luz",
    description: "Filtrar por descrição",
  })
  description?: string;

  @ApiPropertyOptional({
    example: "Utilidades",
    description: "Filtrar por categoria",
  })
  category?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({
    example: "Cartão de Crédito",
    description: "Filtrar por método de pagamento",
  })
  paymentMethod?: string;

  @ApiPropertyOptional({
    example: "PAID,PENDING",
    enum: ExpenseStatus,
    description:
      "Filtrar por status. Use vírgula para múltiplos status: 'PAID,PENDING'",
  })
  status?: ExpenseStatus;

  @ApiPropertyOptional({
    example: "FIXED,VARIABLE",
    enum: ExpenseType,
    description:
      "Filtrar por tipo de despesa. Use vírgula para múltiplos tipos",
  })
  expenseType?: ExpenseType;

  @ApiPropertyOptional({
    example: "2025-07-01",
    description: "Data do gasto (formato YYYY-MM-DD)",
  })
  date?: string;

  @ApiPropertyOptional({
    example: "user-uuid",
    description: "ID do usuário dono do gasto",
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
