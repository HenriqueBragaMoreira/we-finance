import { OmitType, PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { CreateExpenseDto } from "./create-expense.dto";

export class UpdateExpenseDto extends PartialType(
  OmitType(CreateExpenseDto, ["category"])
) {
  @ApiProperty({ example: "category-uuid" })
  categoryId!: string;
}
