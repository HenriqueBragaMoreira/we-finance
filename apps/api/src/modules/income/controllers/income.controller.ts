import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import {
  AuthGuard,
  Session,
  type UserSession,
} from "@thallesp/nestjs-better-auth";
import type { CreateIncomeDto } from "../dtos/create-income.dto";
import type { FilterIncomeDto } from "../dtos/filter-income.dto";
import type { UpdateIncomeDto } from "../dtos/update-income.dto";
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

  @Post()
  @ApiOperation({ summary: "Cria uma nova receita" })
  @ApiBody({
    description: "Dados para criar uma nova receita",
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "Salário de Julho",
          description: "Nome da receita",
        },
        amount: {
          type: "number",
          example: 4500.0,
          description: "Valor da receita",
        },
        type: {
          type: "string",
          example: "Salário",
          description: "Tipo da receita",
        },
        paymentMethod: {
          type: "string",
          example: "PIX",
          description: "Método de pagamento",
        },
        status: {
          type: "string",
          enum: ["PENDING", "RECEIVED"],
          example: "RECEIVED",
          description: "Status da receita",
        },
        receivedAt: {
          type: "string",
          example: "2025-07-01T14:30:00Z",
          description: "Data de recebimento",
        },
        category: {
          type: "string",
          example: "category-uuid",
          description: "ID da categoria",
        },
      },
      required: [
        "name",
        "amount",
        "type",
        "paymentMethod",
        "date",
        "status",
        "receivedAt",
        "category",
      ],
    },
  })
  @ApiResponse({ status: 201, description: "Receita criada com sucesso" })
  create(@Body() data: CreateIncomeDto, @Session() session: UserSession) {
    return this.service.create(data, session.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualiza uma receita existente" })
  @ApiBody({
    description: "Dados para atualizar uma receita existente",
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "Salário de Agosto",
          description: "Nome da receita (opcional)",
        },
        amount: {
          type: "number",
          example: 5000.0,
          description: "Valor da receita (opcional)",
        },
        type: {
          type: "string",
          example: "Salário",
          description: "Tipo da receita (opcional)",
        },
        paymentMethod: {
          type: "string",
          example: "Transferência",
          description: "Método de pagamento (opcional)",
        },
        status: {
          type: "string",
          enum: ["PENDING", "RECEIVED"],
          example: "RECEIVED",
          description: "Status da receita (opcional)",
        },
        receivedAt: {
          type: "string",
          example: "2025-08-01T14:30:00Z",
          description: "Data de recebimento (opcional)",
        },
        categoryId: {
          type: "string",
          example: "category-uuid",
          description: "ID da categoria (opcional)",
        },
      },
    },
  })
  update(@Param("id") id: string, @Body() data: UpdateIncomeDto) {
    return this.service.update(id, data);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove uma receita" })
  delete(@Param("id") id: string) {
    return this.service.delete(id);
  }
}
