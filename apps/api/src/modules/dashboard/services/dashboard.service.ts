import { Injectable } from "@nestjs/common";
import { DashboardRepository } from "../dashboard.repository";
import type { DashboardFilterDto } from "../dtos/dashboard-filter.dto";
import type {
  ExpensesByCategoryResponseDto,
  LastTransactionsResponseDto,
  RevenuesVsExpensesResponseDto,
  SummaryCardsResponseDto,
} from "../dtos/dashboard-response.dto";
import type { TransactionsFilterDto } from "../dtos/transactions-filter.dto";

@Injectable()
export class DashboardService {
  constructor(private readonly repo: DashboardRepository) {}

  private formatPeriod(
    filter: DashboardFilterDto | TransactionsFilterDto
  ): string {
    const now = new Date();
    let years = [now.getFullYear()];
    let months = [now.getMonth() + 1];

    if (filter.year) {
      years = filter.year.split(",").map((y) => Number(y.trim()));
    }

    if (filter.month) {
      const monthNumbers = filter.month
        .split(",")
        .map((m) => {
          const monthName = m.trim().toLowerCase();
          const monthsMap = {
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
          return monthsMap[monthName as keyof typeof monthsMap] || 0;
        })
        .filter((m) => m > 0);

      if (monthNumbers.length > 0) {
        months = monthNumbers;
      }
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

    if (years.length === 1) {
      const year = years[0];

      if (months.length === 1) {
        return `${monthNames[months[0] as keyof typeof monthNames]} ${year}`;
      }

      if (months.length > 1) {
        const sortedMonths = [...months].sort((a, b) => a - b);
        const firstMonth =
          monthNames[sortedMonths[0] as keyof typeof monthNames];
        const lastMonth =
          monthNames[
            sortedMonths[sortedMonths.length - 1] as keyof typeof monthNames
          ];
        return `${firstMonth} - ${lastMonth} ${year}`;
      }

      return `${monthNames[months[0] as keyof typeof monthNames]} ${year}`;
    }

    return `Período selecionado`;
  }

  async getSummaryCards(
    filter: DashboardFilterDto
  ): Promise<SummaryCardsResponseDto> {
    const data = await this.repo.getSummaryCards(filter);

    return {
      ...data,
      period: this.formatPeriod(filter),
    };
  }

  async getExpensesByCategory(
    filter: DashboardFilterDto
  ): Promise<ExpensesByCategoryResponseDto[]> {
    return this.repo.getExpensesByCategory(filter);
  }

  async getRevenuesVsExpenses(
    filter: DashboardFilterDto
  ): Promise<RevenuesVsExpensesResponseDto> {
    const data = await this.repo.getRevenuesVsExpenses(filter);

    return {
      data,
      period: this.formatPeriod(filter),
    };
  }

  async getLastTransactions(
    filter: TransactionsFilterDto
  ): Promise<LastTransactionsResponseDto> {
    return this.repo.getLastTransactions(filter);
  }
}
