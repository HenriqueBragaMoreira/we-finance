import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@thallesp/nestjs-better-auth";
import type { DashboardFilterDto } from "../dtos/dashboard-filter.dto";
import type { TransactionsFilterDto } from "../dtos/transactions-filter.dto";
import { DashboardService } from "../services/dashboard.service";

@Controller("dashboard")
@UseGuards(AuthGuard)
@ApiTags("Dashboard")
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get("summary")
  @ApiOperation({
    summary: "Cards de resumo do dashboard",
    description:
      "Retorna métricas agregadas (receitas, despesas, investimentos e saldo) do período especificado",
  })
  @ApiQuery({
    name: "userId",
    required: false,
    type: String,
    description: "ID do usuário para filtrar dados específicos",
  })
  @ApiQuery({
    name: "month",
    required: false,
    type: String,
    description:
      "Mês(es) para filtrar. Use vírgula para múltiplos: 'janeiro,fevereiro'",
  })
  @ApiQuery({
    name: "year",
    required: false,
    type: String,
    description: "Ano(s) para filtrar. Use vírgula para múltiplos: '2024,2025'",
  })
  @ApiResponse({
    status: 200,
    description: "Resumo financeiro retornado com sucesso",
    schema: {
      type: "object",
      properties: {
        totalRevenues: {
          type: "number",
          example: 15000.0,
          description: "Total de receitas do período",
        },
        totalExpenses: {
          type: "number",
          example: 8000.0,
          description: "Total de despesas do período",
        },
        totalInvestments: {
          type: "number",
          example: 2000.0,
          description: "Total de investimentos do período",
        },
        balance: {
          type: "number",
          example: 5000.0,
          description: "Saldo (receitas - despesas - investimentos)",
        },
        period: {
          type: "string",
          example: "Agosto 2025",
          description: "Período dos dados retornados",
        },
      },
    },
  })
  getSummaryCards(@Query() filter: DashboardFilterDto) {
    return this.service.getSummaryCards(filter);
  }

  @Get("expenses-by-category")
  @ApiOperation({
    summary: "Despesas por categoria (gráfico de pizza)",
    description:
      "Retorna a distribuição percentual das despesas por categoria no período",
  })
  @ApiQuery({
    name: "userId",
    required: false,
    type: String,
    description: "ID do usuário para filtrar dados específicos",
  })
  @ApiQuery({
    name: "month",
    required: false,
    type: String,
    description:
      "Mês(es) para filtrar. Use vírgula para múltiplos: 'janeiro,fevereiro'",
  })
  @ApiQuery({
    name: "year",
    required: false,
    type: String,
    description: "Ano(s) para filtrar. Use vírgula para múltiplos: '2024,2025'",
  })
  @ApiResponse({
    status: 200,
    description: "Distribuição de despesas por categoria retornada com sucesso",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          categoryName: {
            type: "string",
            example: "Transporte",
            description: "Nome da categoria",
          },
          amount: {
            type: "number",
            example: 1500.0,
            description: "Valor total gasto na categoria",
          },
          percentage: {
            type: "number",
            example: 18.75,
            description: "Percentual do total de despesas",
          },
        },
      },
    },
  })
  getExpensesByCategory(@Query() filter: DashboardFilterDto) {
    return this.service.getExpensesByCategory(filter);
  }

  @Get("revenues-vs-expenses")
  @ApiOperation({
    summary: "Receitas vs Despesas (gráfico de barras)",
    description: "Compara os totais de receitas e despesas do período",
  })
  @ApiQuery({
    name: "userId",
    required: false,
    type: String,
    description: "ID do usuário para filtrar dados específicos",
  })
  @ApiQuery({
    name: "month",
    required: false,
    type: String,
    description:
      "Mês(es) para filtrar. Use vírgula para múltiplos: 'janeiro,fevereiro'",
  })
  @ApiQuery({
    name: "year",
    required: false,
    type: String,
    description: "Ano(s) para filtrar. Use vírgula para múltiplos: '2024,2025'",
  })
  @ApiResponse({
    status: 200,
    description: "Comparação de receitas vs despesas retornada com sucesso",
    schema: {
      type: "object",
      properties: {
        revenues: {
          type: "number",
          example: 15000.0,
          description: "Total de receitas do período",
        },
        expenses: {
          type: "number",
          example: 8000.0,
          description: "Total de despesas do período",
        },
        period: {
          type: "string",
          example: "Agosto 2025",
          description: "Período dos dados retornados",
        },
      },
    },
  })
  getRevenuesVsExpenses(@Query() filter: DashboardFilterDto) {
    return this.service.getRevenuesVsExpenses(filter);
  }

  @Get("transactions")
  @ApiOperation({
    summary: "Últimas transações",
    description:
      "Retorna as últimas transações (receitas, despesas e investimentos) com paginação",
  })
  @ApiQuery({
    name: "userId",
    required: false,
    type: String,
    description: "ID do usuário para filtrar dados específicos",
  })
  @ApiQuery({
    name: "month",
    required: false,
    type: String,
    description:
      "Mês(es) para filtrar. Use vírgula para múltiplos: 'janeiro,fevereiro'",
  })
  @ApiQuery({
    name: "year",
    required: false,
    type: String,
    description: "Ano(s) para filtrar. Use vírgula para múltiplos: '2024,2025'",
  })
  @ApiQuery({
    name: "init",
    required: false,
    type: String,
    example: "0",
    description: "Número da página",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: String,
    example: "10",
    description: "Número máximo de registros por página",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de transações retornada com sucesso",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", example: "transaction-uuid-123" },
              name: { type: "string", example: "Salário de Agosto" },
              amount: { type: "number", example: 4500.0 },
              type: {
                type: "string",
                example: "INCOME",
                enum: ["INCOME", "EXPENSE", "INVESTMENT"],
              },
              status: {
                type: "string",
                example: "RECEIVED",
                description:
                  "Status da transação (apenas para receitas e despesas)",
              },
              date: {
                type: "string",
                example: "2025-08-01T14:30:00.000Z",
                description: "Data da transação",
              },
              category: { type: "string", example: "Salário" },
              paymentMethod: {
                type: "string",
                example: "PIX",
                description:
                  "Método de pagamento (apenas para receitas e despesas)",
              },
              user: { type: "string", example: "João Silva" },
              createdAt: {
                type: "string",
                example: "2025-08-04T10:00:00.000Z",
              },
            },
          },
        },
        totalLength: {
          type: "number",
          example: 150,
          description: "Total de transações no período (para paginação)",
        },
      },
    },
  })
  getLastTransactions(@Query() filter: TransactionsFilterDto) {
    return this.service.getLastTransactions(filter);
  }
}
