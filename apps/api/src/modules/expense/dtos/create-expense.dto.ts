import { ApiProperty } from "@nestjs/swagger";

enum ExpenseStatus {
  PENDING = "PENDING",
  PAID = "PAID",
}

enum ExpenseType {
  FIXED = "FIXED",
  VARIABLE = "VARIABLE",
}

export class CreateExpenseDto {
  @ApiProperty({ example: "Conta de Luz" })
  name!: string;

  @ApiProperty({
    example: "FIXED",
    enum: ExpenseType,
    description: "Tipo da despesa",
  })
  expenseType!: ExpenseType;

  @ApiProperty({ example: 150.5 })
  amount!: number;

  @ApiProperty({
    example: "uuid-do-metodo-pagamento",
    description: "ID do método de pagamento",
  })
  paymentMethodId!: string;

  @ApiProperty({ example: "PENDING", enum: ExpenseStatus })
  status!: ExpenseStatus;

  @ApiProperty({
    example: "2025-07-01",
    description: "Data do gasto",
  })
  spentAt!: Date;

  @ApiProperty({ example: "uuid-da-categoria", description: "ID da categoria" })
  categoryId!: string;

  @ApiProperty({
    example: 12,
    description:
      "Número de parcelas (opcional). Se informado, criará as parcelas automaticamente dividindo o valor total",
    required: false,
  })
  installmentsCount?: number;
}
