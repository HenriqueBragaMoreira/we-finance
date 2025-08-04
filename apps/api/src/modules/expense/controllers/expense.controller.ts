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
import type { CreateExpenseDto } from "../dtos/create-expense.dto";
import type { FilterExpenseDto } from "../dtos/filter-expense.dto";
import type { MonthlyStatsDto } from "../dtos/monthly-stats.dto";
import type { UpdateExpenseDto } from "../dtos/update-expense.dto";
import { ExpenseService } from "../services/expense.service";

@Controller("expenses")
@UseGuards(AuthGuard)
export class ExpenseController {
  constructor(private readonly service: ExpenseService) {}

  @Get()
  @ApiOperation({ summary: "Lista gastos com filtros e paginação" })
  @ApiQuery({ name: "description", required: false, type: String })
  @ApiQuery({ name: "category", required: false, type: String })
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
    name: "expenseType",
    required: false,
    type: String,
    description:
      "Filtrar por tipo de despesa. Use vírgula para múltiplos: 'FIXED,VARIABLE'",
  })
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
    description: "Lista paginada de gastos com total de registros",
  })
  findAll(@Query() filter: FilterExpenseDto) {
    return this.service.findAll(filter);
  }

  @Get("monthly-stats")
  @ApiOperation({
    summary: "Estatísticas mensais de despesas",
    description:
      "Retorna o total, pagas e pendentes do mês atual ou mês especificado",
  })
  @ApiQuery({
    name: "month",
    required: false,
    type: String,
    description:
      "Mês no formato YYYY-MM (ex: 2025-08). Se não informado, usa o mês atual",
    example: "2025-08",
  })
  @ApiResponse({
    status: 200,
    description: "Estatísticas mensais retornadas com sucesso",
    schema: {
      type: "object",
      properties: {
        totalExpenses: {
          type: "number",
          example: 3000.0,
          description: "Total de despesas no mês",
        },
        paid: {
          type: "number",
          example: 1800.0,
          description: "Total de despesas pagas no mês",
        },
        pending: {
          type: "number",
          example: 1200.0,
          description: "Total de despesas pendentes no mês",
        },
        month: {
          type: "string",
          example: "2025-08",
          description: "Mês dos dados retornados",
        },
      },
    },
  })
  getMonthlyStats(
    @Query() filter: MonthlyStatsDto,
    @Session() session: UserSession
  ) {
    return this.service.getMonthlyStats(session.user.id, filter);
  }

  @Post()
  @ApiOperation({ summary: "Cria um novo gasto" })
  @ApiBody({
    description: "Dados para criar um novo gasto",
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "Conta de Luz",
          description: "Nome do gasto",
        },
        amount: {
          type: "number",
          example: 150.5,
          description: "Valor do gasto",
        },
        paymentMethod: {
          type: "string",
          example: "Cartão de Crédito",
          description: "Método de pagamento",
        },
        status: {
          type: "string",
          enum: ["PENDING", "PAID"],
          example: "PENDING",
          description: "Status do gasto",
        },
        spentAt: {
          type: "string",
          example: "2025-07-01T14:30:00Z",
          description: "Data do gasto",
        },
        category: {
          type: "string",
          example: "Utilidades",
          description: "Nome da categoria",
        },
        installmentsCount: {
          type: "number",
          example: 12,
          description:
            "Número de parcelas (opcional). Se informado, criará as parcelas automaticamente",
        },
      },
      required: [
        "name",
        "amount",
        "paymentMethod",
        "status",
        "spentAt",
        "category",
      ],
    },
  })
  @ApiResponse({ status: 201, description: "Gasto criado com sucesso" })
  create(@Body() data: CreateExpenseDto, @Session() session: UserSession) {
    return this.service.create(data, session.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualiza um gasto existente" })
  @ApiBody({
    description: "Dados para atualizar um gasto existente",
    schema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "Conta de Luz - Agosto",
          description: "Nome do gasto (opcional)",
        },
        amount: {
          type: "number",
          example: 175.0,
          description: "Valor do gasto (opcional)",
        },
        paymentMethod: {
          type: "string",
          example: "PIX",
          description: "Método de pagamento (opcional)",
        },
        status: {
          type: "string",
          enum: ["PENDING", "PAID"],
          example: "PAID",
          description: "Status do gasto (opcional)",
        },
        spentAt: {
          type: "string",
          example: "2025-08-01T14:30:00Z",
          description: "Data do gasto (opcional)",
        },
        categoryId: {
          type: "string",
          example: "category-uuid",
          description: "ID da categoria (opcional)",
        },
      },
    },
  })
  update(@Param("id") id: string, @Body() data: UpdateExpenseDto) {
    return this.service.update(id, data);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove um gasto" })
  delete(@Param("id") id: string) {
    return this.service.delete(id);
  }
}
