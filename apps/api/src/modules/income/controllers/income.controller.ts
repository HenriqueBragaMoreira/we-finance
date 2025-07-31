import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "@thallesp/nestjs-better-auth";
import type { FilterIncomeDto } from "../dtos/filter-income.dto";
import { IncomeService } from "../services/income.service";

@Controller("incomes")
@UseGuards(AuthGuard)
export class IncomeController {
  constructor(private readonly service: IncomeService) {}

  @Get()
  @ApiOperation({ summary: "Lista receitas com filtros e paginação" })
  @ApiQuery({ name: "description", required: false, type: String })
  @ApiQuery({ name: "type", required: false, type: String })
  @ApiQuery({ name: "amount", required: false, type: Number })
  @ApiQuery({ name: "paymentMethod", required: false, type: String })
  @ApiQuery({
    name: "date",
    required: false,
    description: "yyyy-mm-dd",
    type: String,
  })
  @ApiQuery({ name: "userId", required: false, type: String })
  @ApiQuery({ name: "status", required: false, type: String })
  @ApiQuery({
    name: "init",
    required: false,
    type: String,
    example: "0",
    description: "Número da página",
  })
  @ApiQuery({ name: "limit", required: false, type: String, example: "10" })
  @ApiResponse({
    status: 200,
    description: "Lista paginada de receitas com total de registros",
  })
  findAll(@Query() filter: FilterIncomeDto) {
    return this.service.findAll(filter);
  }
}
