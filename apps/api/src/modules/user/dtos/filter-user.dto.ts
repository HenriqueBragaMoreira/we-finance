import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FilterUserDto {
  @ApiPropertyOptional({
    example: "João Silva",
    description: "Filtrar por nome do usuário",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: "joao@email.com",
    description: "Filtrar por email do usuário",
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    example: "true",
    description: "Filtrar por status de verificação de email (true/false)",
  })
  @IsOptional()
  @IsString()
  emailVerified?: string;

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
