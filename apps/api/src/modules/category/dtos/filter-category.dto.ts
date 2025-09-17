import { ApiPropertyOptional } from "@nestjs/swagger";

enum CategoryType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  INVESTMENT = "INVESTMENT",
}

export class FilterCategoryDto {
  @ApiPropertyOptional({
    example: "Salário,Vendas",
    description:
      "Filtrar por nome da categoria. Use vírgula para múltiplas categorias",
  })
  name?: string;

  @ApiPropertyOptional({
    example: "INCOME,EXPENSE",
    enum: CategoryType,
    description:
      "Filtrar por tipo de categoria. Use vírgula para múltiplos tipos",
  })
  type?: CategoryType;

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

  @ApiPropertyOptional({
    example: "true,false",
    description:
      "Filtrar por status da categoria. Use vírgula para múltiplos status",
  })
  status?: string;

  @ApiPropertyOptional({
    example: "red,blue",
    description:
      "Filtrar por cor da categoria. Use vírgula para múltiplas cores",
  })
  color?: string;

  @ApiPropertyOptional({
    example: "2025-01-01",
    description: "Filtrar por data de criação da categoria",
  })
  createdAt?: string;

  @ApiPropertyOptional({
    example: "2025-01-01",
    description: "Filtrar por data de atualização da categoria",
  })
  updatedAt?: string;
}
