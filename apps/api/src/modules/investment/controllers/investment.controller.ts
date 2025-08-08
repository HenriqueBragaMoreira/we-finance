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
import type { CreateInvestmentDto } from "../dtos/create-investment.dto";
import type { FilterInvestmentDto } from "../dtos/filter-investment.dto";
import type { MonthlyStatsDto } from "../dtos/monthly-stats.dto";
import type { UpdateInvestmentDto } from "../dtos/update-investment.dto";
import { InvestmentService } from "../services/investment.service";

@Controller("investments")
@UseGuards(AuthGuard)
export class InvestmentController {
  constructor(private readonly service: InvestmentService) {}

  @Get()
  @ApiOperation({ summary: "Lista investimentos com filtros e paginação" })
  @ApiQuery({ name: "amount", required: false, type: Number })
  @ApiQuery({
    name: "investedAt",
    required: false,
    description: "yyyy-mm-dd",
    type: String,
  })
  @ApiQuery({ name: "notes", required: false, type: String })
  @ApiQuery({ name: "userId", required: false, type: String })
  @ApiQuery({ name: "categoryId", required: false, type: String })
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
    description: "Lista paginada de investimentos com total de registros",
  })
  findAll(@Query() filter: FilterInvestmentDto) {
    return this.service.findAll(filter);
  }

  @Get("monthly-stats")
  @ApiOperation({
    summary: "Estatísticas mensais de investimentos de todos os usuários",
    description:
      "Retorna o total investido e detalhamento por usuário do mês atual ou mês especificado para todos os usuários do sistema",
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
        totalInvestments: {
          type: "number",
          example: 8000.0,
          description: "Total investido por todos os usuários no mês",
        },
        month: {
          type: "string",
          example: "2025-08",
          description: "Mês dos dados retornados",
        },
        userStats: {
          type: "array",
          description: "Estatísticas por usuário",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
                example: "João Silva",
                description: "Nome do usuário",
              },
              amount: {
                type: "number",
                example: 3500.0,
                description: "Total investido pelo usuário no mês",
              },
            },
          },
          example: [
            {
              name: "João Silva",
              amount: 4500.0,
            },
            {
              name: "Maria Santos",
              amount: 3500.0,
            },
          ],
        },
      },
    },
  })
  getMonthlyStats(@Query() filter: MonthlyStatsDto) {
    return this.service.getMonthlyStats(filter);
  }

  @Post()
  @ApiOperation({ summary: "Cria um novo investimento" })
  @ApiBody({
    description: "Dados para criar um novo investimento",
    schema: {
      type: "object",
      properties: {
        notes: {
          type: "string",
          example: "Ações da Petrobras",
          description: "Nome do investimento",
        },
        amount: {
          type: "number",
          example: 1500.75,
          description: "Valor do investimento",
        },
        investedAt: {
          type: "string",
          example: "2025-07-01T14:30:00Z",
          description: "Data do investimento",
        },
        category: {
          type: "string",
          example: "Ações",
          description: "Nome da categoria",
        },
      },
      required: ["notes", "amount", "investedAt", "category"],
    },
  })
  @ApiResponse({ status: 201, description: "Investimento criado com sucesso" })
  create(@Body() data: CreateInvestmentDto, @Session() session: UserSession) {
    return this.service.create(data, session.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualiza um investimento existente" })
  @ApiBody({
    description: "Dados para atualizar um investimento existente",
    schema: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          example: 2000.0,
          description: "Valor do investimento (opcional)",
        },
        investedAt: {
          type: "string",
          example: "2025-08-01T14:30:00Z",
          description: "Data do investimento (opcional)",
        },
        notes: {
          type: "string",
          example: "Investimento atualizado",
          description: "Observações sobre o investimento (opcional)",
        },
        category: {
          type: "string",
          example: "Ações",
          description:
            "Nome da categoria - será criada se não existir (opcional)",
        },
      },
      additionalProperties: false,
    },
  })
  update(@Param("id") id: string, @Body() data: UpdateInvestmentDto) {
    return this.service.update(id, data);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove um investimento" })
  delete(@Param("id") id: string) {
    return this.service.delete(id);
  }
}
