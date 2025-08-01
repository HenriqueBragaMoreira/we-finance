import { ApiProperty } from "@nestjs/swagger";

export class CreateInvestmentDto {
  @ApiProperty({ example: "Ações da Petrobras" })
  name!: string;

  @ApiProperty({ example: 1500.75 })
  amount!: number;

  @ApiProperty({
    example: "2025-07-01",
    description: "Data do investimento",
  })
  investedAt!: Date;

  @ApiProperty({
    example: "Investimento de longo prazo",
    description: "Observações sobre o investimento (opcional)",
    required: false,
  })
  notes?: string;

  @ApiProperty({ example: "Ações" })
  category!: string;
}
