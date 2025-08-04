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
import type { MonthlyStatsDto } from "../dtos/monthly-stats.dto";
import type { UpdateIncomeDto } from "../dtos/update-income.dto";
import { IncomeService } from "../services/income.service";

@Controller("incomes")
@UseGuards(AuthGuard)
export class IncomeController {
  constructor(private readonly service: IncomeService) {}

  @Get()
  @ApiOperation({ summary: "Lista receitas com filtros e paginação" })
  @ApiQuery({ name: "description", required: false, type: String })
  @ApiQuery({
    name: "category",
    required: false,
    type: String,
    description:
      "Filtrar por categoria(s). Use vírgula para múltiplas: 'Salário,Vendas'",
  })
  @ApiQuery({ name: "amount", required: false, type: Number })
  @ApiQuery({
    name: "paymentMethod",
    required: false,
    type: String,
    description:
      "Filtrar por método(s) de pagamento. Use vírgula para múltiplos: 'PIX,Transferência'",
  })
  @ApiQuery({
    name: "date",
    required: false,
    description: "yyyy-mm-dd",
    type: String,
  })
  @ApiQuery({ name: "userId", required: false, type: String })
  @ApiQuery({
    name: "status",
    required: false,
    type: String,
    description:
      "Filtrar por status. Use vírgula para múltiplos: 'RECEIVED,PENDING'",
  })
  @ApiQuery({
    name: "incomeType",
    required: false,
    type: String,
    description:
      "Filtrar por tipo de receita. Use vírgula para múltiplos: 'FIXED,VARIABLE'",
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
    description: "Lista paginada de receitas com total de registros",
  })
  findAll(@Query() filter: FilterIncomeDto) {
    return this.service.findAll(filter);
  }

  @Get("monthly-stats")
  @ApiOperation({
    summary: "Estatísticas mensais de receitas",
    description:
      "Retorna o total, recebidas e pendentes do mês atual ou mês especificado",
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
        totalRevenues: {
          type: "number",
          example: 5000.0,
          description: "Total de receitas no mês",
        },
        received: {
          type: "number",
          example: 3000.0,
          description: "Total de receitas recebidas no mês",
        },
        pending: {
          type: "number",
          example: 2000.0,
          description: "Total de receitas pendentes no mês",
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

  @Get(":id")
  @ApiOperation({
    summary: "Busca uma receita específica por ID",
    description:
      "Retorna os dados de uma receita específica incluindo categoria, método de pagamento e usuário",
  })
  @ApiResponse({
    status: 200,
    description: "Receita encontrada com sucesso",
    schema: {
      type: "object",
      properties: {
        id: { type: "string", example: "income-uuid-123" },
        name: { type: "string", example: "Salário de Julho" },
        amount: { type: "number", example: 4500.0 },
        incomeType: {
          type: "string",
          example: "FIXED",
          enum: ["FIXED", "VARIABLE"],
        },
        status: {
          type: "string",
          example: "RECEIVED",
          enum: ["PENDING", "RECEIVED"],
        },
        receivedAt: { type: "string", example: "2025-07-01T14:30:00.000Z" },
        user: { type: "string", example: "João Silva" },
        category: { type: "string", example: "Salário" },
        paymentMethod: { type: "string", example: "PIX" },
        createdAt: { type: "string", example: "2025-08-04T10:00:00.000Z" },
        updatedAt: { type: "string", example: "2025-08-04T10:00:00.000Z" },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Receita não encontrada",
  })
  findById(@Param("id") id: string) {
    return this.service.findById(id);
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
        incomeType: {
          type: "string",
          example: "FIXED",
          description: "Tipo de receita",
        },
        category: {
          type: "string",
          example: "Salário",
          description: "Nome da categoria (será criada se não existir)",
        },
        amount: {
          type: "number",
          example: 4500.0,
          description: "Valor da receita",
        },
        paymentMethod: {
          type: "string",
          example: "PIX",
          description:
            "Nome do método de pagamento (será criado se não existir)",
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
      },
      required: ["name", "amount", "status", "receivedAt", "category"],
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
        paymentMethod: {
          type: "string",
          example: "PIX",
          description:
            "Nome do método de pagamento (opcional - será criado se não existir)",
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
        category: {
          type: "string",
          example: "Salário",
          description:
            "Nome da categoria (opcional - será criada se não existir)",
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
