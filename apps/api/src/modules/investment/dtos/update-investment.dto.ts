import { OmitType, PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { CreateInvestmentDto } from "./create-investment.dto";

export class UpdateInvestmentDto extends PartialType(
  OmitType(CreateInvestmentDto, ["category"])
) {
  @ApiProperty({ example: "category-uuid" })
  categoryId!: string;
}
