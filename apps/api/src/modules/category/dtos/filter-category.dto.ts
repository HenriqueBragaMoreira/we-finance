import { ApiPropertyOptional } from "@nestjs/swagger";

enum CategoryType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  INVESTMENT = "INVESTMENT",
}

export class FilterCategoryDto {
  @ApiPropertyOptional({
    example: "Salário",
    description: "Filtrar por nome da categoria",
  })
  name?: string;

  @ApiPropertyOptional({
    example: "INCOME",
    enum: CategoryType,
    description: "Filtrar por tipo de categoria",
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
}
