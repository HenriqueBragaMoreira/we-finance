import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetUserByIdDto {
  @ApiProperty({
    example: "user-uuid-123",
    description: "ID único do usuário",
  })
  @IsString()
  id!: string;
}
