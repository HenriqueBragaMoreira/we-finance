import { ApiProperty } from "@nestjs/swagger";

enum CategoryType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  INVESTMENT = "INVESTMENT",
}

export class CreateCategoryDto {
  @ApiProperty({ example: "Salário" })
  name!: string;

  @ApiProperty({
    example: "INCOME",
    enum: CategoryType,
    description: "Tipo da categoria",
  })
  type!: CategoryType;

  @ApiProperty({ example: "#123456" })
  color!: string;
}
