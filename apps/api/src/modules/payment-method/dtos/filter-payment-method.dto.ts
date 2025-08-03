import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FilterPaymentMethodDto {
  @ApiPropertyOptional({
    example: "PIX",
    description: "Filtrar por nome do método de pagamento",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: "true",
    description: "Filtrar por status ativo (true/false)",
  })
  @IsOptional()
  @IsString()
  isActive?: string;

  @ApiPropertyOptional({
    example: "0",
    description: "Número da página",
  })
  @IsOptional()
  @IsString()
  init?: string;

  @ApiPropertyOptional({
    example: "10",
    description: "Número máximo de registros (paginação)",
  })
  @IsOptional()
  @IsString()
  limit?: string;
}
