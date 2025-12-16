import { ApiProperty } from "@nestjs/swagger";

enum IncomeStatus {
  PENDING = "PENDING",
  RECEIVED = "RECEIVED",
}

enum IncomeType {
  FIXED = "FIXED",
  VARIABLE = "VARIABLE",
}

export class CreateIncomeDto {
  @ApiProperty({ example: "Salário de Julho" })
  name!: string;

  @ApiProperty({ example: "uuid-da-categoria", description: "ID da categoria" })
  categoryId!: string;

  @ApiProperty({
    example: "FIXED",
    enum: IncomeType,
    description: "Tipo da receita",
  })
  incomeType!: IncomeType;

  @ApiProperty({ example: 4500.0 })
  amount!: number;

  @ApiProperty({
    example: "uuid-do-metodo-pagamento",
    description: "ID do método de pagamento",
  })
  paymentMethodId!: string;

  @ApiProperty({ example: "RECEIVED", enum: IncomeStatus })
  status!: IncomeStatus;

  @ApiProperty({
    example: "2025-07-01",
    description: "Data de recebimento",
  })
  receivedAt!: Date;
}
