import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/utils/prisma.service";
import type { DashboardFilterDto } from "./dtos/dashboard-filter.dto";
import type { TransactionsFilterDto } from "./dtos/transactions-filter.dto";

// Tipo para transações normalizadas
type NormalizedTransaction = {
  id: string;
  name: string;
  amount: number;
  type: "INCOME" | "EXPENSE" | "INVESTMENT";
  status?: string;
  date: Date;
  category: string;
  paymentMethod?: string;
  user: string;
  createdAt: Date;
};

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  private getMonthNumber(monthName: string): number {
    const months = {
      janeiro: 1,
      fevereiro: 2,
      março: 3,
      abril: 4,
      maio: 5,
      junho: 6,
      julho: 7,
      agosto: 8,
      setembro: 9,
      outubro: 10,
      novembro: 11,
      dezembro: 12,
    };
    return months[monthName.toLowerCase() as keyof typeof months] || 0;
  }

  private buildDateConditions(
    filter: DashboardFilterDto | TransactionsFilterDto
  ) {
    const now = new Date();
    let years = [now.getFullYear()];
    let months = [now.getMonth() + 1];

    if (filter.year) {
      years = filter.year.split(",").map((y) => Number(y.trim()));
    }

    if (filter.month) {
      months = filter.month
        .split(",")
        .map((m) => this.getMonthNumber(m.trim()))
        .filter((m) => m > 0);
    }

    const dateConditions: { gte: Date; lt: Date }[] = [];

    for (const year of years) {
      for (const month of months) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        dateConditions.push({
          gte: startDate,
          lt: endDate,
        });
      }
    }

    return dateConditions.length === 1
      ? dateConditions[0]
      : { OR: dateConditions };
  }

  async getSummaryCards(filter: DashboardFilterDto) {
    const dateCondition = this.buildDateConditions(filter);
    const userCondition = filter.userId ? { userId: filter.userId } : {};

    // Construir condições where corretas para múltiplas datas
    const buildWhereCondition = (dateField: string) => {
      if ("OR" in dateCondition) {
        return {
          ...userCondition,
          OR: dateCondition.OR.map((condition) => ({
            [dateField]: condition,
          })),
        };
      } else {
        return {
          ...userCondition,
          [dateField]: dateCondition,
        };
      }
    };

    // Total de receitas
    const revenuesResult = await this.prisma.income.aggregate({
      where: buildWhereCondition("receivedAt"),
      _sum: {
        amount: true,
      },
    });

    // Total de despesas
    const expensesResult = await this.prisma.expense.aggregate({
      where: buildWhereCondition("spentAt"),
      _sum: {
        amount: true,
      },
    });

    // Total de investimentos
    const investmentsResult = await this.prisma.investment.aggregate({
      where: buildWhereCondition("investedAt"),
      _sum: {
        amount: true,
      },
    });

    const totalRevenues = revenuesResult._sum?.amount?.toNumber() || 0;
    const totalExpenses = expensesResult._sum?.amount?.toNumber() || 0;
    const totalInvestments = investmentsResult._sum?.amount?.toNumber() || 0;
    const balance = totalRevenues - totalExpenses - totalInvestments;

    return {
      totalRevenues,
      totalExpenses,
      totalInvestments,
      balance,
    };
  }

  async getExpensesByCategory(filter: DashboardFilterDto) {
    const dateCondition = this.buildDateConditions(filter);
    const userCondition = filter.userId ? { userId: filter.userId } : {};

    // Construir condições where corretas para múltiplas datas
    const buildWhereCondition = () => {
      if ("OR" in dateCondition) {
        return {
          ...userCondition,
          OR: dateCondition.OR.map((condition) => ({
            spentAt: condition,
          })),
        };
      } else {
        return {
          ...userCondition,
          spentAt: dateCondition,
        };
      }
    };

    const whereClause = buildWhereCondition();

    // Total de despesas para calcular percentuais
    const totalExpensesResult = await this.prisma.expense.aggregate({
      where: whereClause,
      _sum: {
        amount: true,
      },
    });

    const totalExpenses = totalExpensesResult._sum?.amount?.toNumber() || 0;

    if (totalExpenses === 0) {
      return [];
    }

    // Despesas agrupadas por categoria
    const expensesByCategory = await this.prisma.expense.groupBy({
      by: ["categoryId"],
      where: whereClause,
      _sum: {
        amount: true,
      },
    });

    // Buscar nomes das categorias
    const categoryIds = expensesByCategory.map((item) => item.categoryId);
    const categories = await this.prisma.category.findMany({
      where: {
        id: { in: categoryIds },
      },
      select: {
        id: true,
        name: true,
        color: true,
      },
    });

    const categoryMap = new Map(
      categories.map((cat) => [cat.id, { name: cat.name, color: cat.color }])
    );

    return expensesByCategory.map((item) => {
      const amount = item._sum?.amount?.toNumber() || 0;
      const percentage = (amount / totalExpenses) * 100;

      return {
        categoryName:
          categoryMap.get(item.categoryId)?.name || "Categoria não encontrada",
        amount,
        percentage: Math.round(percentage * 100) / 100,
        categoryColor: categoryMap.get(item.categoryId)?.color || "",
      };
    });
  }

  async getRevenuesVsExpenses(filter: DashboardFilterDto) {
    const now = new Date();
    let years = [now.getFullYear()];
    let months = [now.getMonth() + 1];

    if (filter.year) {
      years = filter.year.split(",").map((y) => Number(y.trim()));
    }

    if (filter.month) {
      months = filter.month
        .split(",")
        .map((m) => this.getMonthNumber(m.trim()))
        .filter((m) => m > 0);
    }

    const monthNames = {
      1: "Janeiro",
      2: "Fevereiro",
      3: "Março",
      4: "Abril",
      5: "Maio",
      6: "Junho",
      7: "Julho",
      8: "Agosto",
      9: "Setembro",
      10: "Outubro",
      11: "Novembro",
      12: "Dezembro",
    };

    const userCondition = filter.userId ? { userId: filter.userId } : {};
    const data: { month: string; revenues: number; expenses: number }[] = [];

    // Para cada ano e mês, buscar os dados
    for (const year of years) {
      for (const month of months) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const whereCondition = {
          gte: startDate,
          lt: endDate,
        };

        const [revenuesResult, expensesResult] = await Promise.all([
          this.prisma.income.aggregate({
            where: {
              ...userCondition,
              receivedAt: whereCondition,
            },
            _sum: {
              amount: true,
            },
          }),
          this.prisma.expense.aggregate({
            where: {
              ...userCondition,
              spentAt: whereCondition,
            },
            _sum: {
              amount: true,
            },
          }),
        ]);

        data.push({
          month: monthNames[month as keyof typeof monthNames],
          revenues: revenuesResult._sum?.amount?.toNumber() || 0,
          expenses: expensesResult._sum?.amount?.toNumber() || 0,
        });
      }
    }

    // Ordenar por mês se for o mesmo ano
    if (years.length === 1) {
      data.sort((a, b) => {
        const monthOrder = Object.values(monthNames);
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      });
    }

    return data;
  }

  async getLastTransactions(filter: TransactionsFilterDto) {
    const { init, limit, ...filters } = filter;

    const page = Number(init) || 0;
    const pageSize = limit ? Number(limit) : 10;
    const skip = page * pageSize;

    const dateCondition = this.buildDateConditions(filters);
    const userCondition = filters.userId ? { userId: filters.userId } : {};

    // Construir condições where corretas para múltiplas datas
    const buildWhereCondition = (dateField: string) => {
      if ("OR" in dateCondition) {
        return {
          ...userCondition,
          OR: dateCondition.OR.map((condition) => ({
            [dateField]: condition,
          })),
        };
      } else {
        return {
          ...userCondition,
          [dateField]: dateCondition,
        };
      }
    };

    // Buscar receitas
    const incomes = await this.prisma.income.findMany({
      where: buildWhereCondition("receivedAt"),
      include: {
        category: { select: { name: true } },
        paymentMethod: { select: { name: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Buscar despesas
    const expenses = await this.prisma.expense.findMany({
      where: buildWhereCondition("spentAt"),
      include: {
        category: { select: { name: true } },
        paymentMethod: { select: { name: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Buscar investimentos
    const investments = await this.prisma.investment.findMany({
      where: buildWhereCondition("investedAt"),
      include: {
        category: { select: { name: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Normalizar dados
    const normalizedIncomes: NormalizedTransaction[] = incomes.map(
      (income) => ({
        id: income.id,
        name: income.name,
        amount: income.amount.toNumber(),
        type: "INCOME" as const,
        status: income.status,
        date: income.receivedAt,
        category: income.category.name,
        paymentMethod: income.paymentMethod.name,
        user: income.user.name,
        createdAt: income.createdAt,
      })
    );

    const normalizedExpenses: NormalizedTransaction[] = expenses.map(
      (expense) => ({
        id: expense.id,
        name: expense.name,
        amount: expense.amount.toNumber(),
        type: "EXPENSE" as const,
        status: expense.status,
        date: expense.spentAt,
        category: expense.category.name,
        paymentMethod: expense.paymentMethod.name,
        user: expense.user.name,
        createdAt: expense.createdAt,
      })
    );

    const normalizedInvestments: NormalizedTransaction[] = investments.map(
      (investment) => ({
        id: investment.id,
        name: investment.notes || "Investimento",
        amount: investment.amount.toNumber(),
        type: "INVESTMENT" as const,
        date: investment.investedAt,
        category: investment.category.name,
        user: investment.user.name,
        createdAt: investment.createdAt,
      })
    );

    // Combinar e ordenar todas as transações
    const allTransactions = [
      ...normalizedIncomes,
      ...normalizedExpenses,
      ...normalizedInvestments,
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    const totalLength = allTransactions.length;
    const paginatedData = allTransactions.slice(skip, skip + pageSize);

    return {
      data: paginatedData,
      totalLength,
    };
  }
}
