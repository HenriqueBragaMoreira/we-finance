import { ApiProperty } from "@nestjs/swagger";

enum ExpenseStatus {
  PENDING = "PENDING",
  PAID = "PAID",
}

export class UpdateInstallmentDto {
  @ApiProperty({
    example: "2025-08-15T00:00:00Z",
    description: "Data de vencimento da parcela",
    required: false,
  })
  dueDate?: Date;

  @ApiProperty({
    example: "PAID",
    enum: ExpenseStatus,
    description: "Status da parcela",
    required: false,
  })
  status?: ExpenseStatus;
}
