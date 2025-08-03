import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentMethodDto {
  @ApiProperty({
    example: "PIX",
    description: "Nome do método de pagamento",
  })
  name!: string;

  @ApiProperty({
    example: true,
    description: "Se o método de pagamento está ativo",
    default: true,
  })
  isActive?: boolean;
}
