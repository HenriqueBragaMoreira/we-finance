import { ApiProperty } from "@nestjs/swagger";

enum IncomeStatus {
  PENDING = "PENDING",
  RECEIVED = "RECEIVED",
}

export class CreateIncomeDto {
  @ApiProperty({ example: "Salário de Julho" })
  name!: string;

  @ApiProperty({ example: "category-uuid" })
  category!: string;

  @ApiProperty({ example: 4500.0 })
  amount!: number;

  @ApiProperty({ example: "PIX", description: "Nome do método de pagamento" })
  paymentMethod!: string;

  @ApiProperty({ example: "RECEIVED", enum: IncomeStatus })
  status!: IncomeStatus;

  @ApiProperty({
    example: "2025-07-01",
    description: "Data de recebimento",
  })
  receivedAt!: Date;
}
