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
    example: "PIX",
    description: "Nome do método de pagamento",
  })
  paymentMethod!: string;

  @ApiProperty({ example: "PENDING", enum: ExpenseStatus })
  status!: ExpenseStatus;

  @ApiProperty({
    example: "2025-07-01",
    description: "Data do gasto",
  })
  spentAt!: Date;

  @ApiProperty({ example: "Utilidades" })
  category!: string;

  @ApiProperty({
    example: 12,
    description:
      "Número de parcelas (opcional). Se informado, criará as parcelas automaticamente dividindo o valor total",
    required: false,
  })
  installmentsCount?: number;
}
