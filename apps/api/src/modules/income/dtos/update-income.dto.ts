import { OmitType, PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { CreateIncomeDto } from "./create-income.dto";

export class UpdateIncomeDto extends PartialType(
  OmitType(CreateIncomeDto, ["category"])
) {
  @ApiProperty({ example: "category-uuid" })
  categoryId?: string;
}
