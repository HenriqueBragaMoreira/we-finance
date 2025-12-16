import { Injectable } from "@nestjs/common";
import type { CreateIncomeDto } from "../dtos/create-income.dto";
import { FilterIncomeDto } from "../dtos/filter-income.dto";
import type {
  MonthlyStatsDto,
  MonthlyStatsResponseDto,
} from "../dtos/monthly-stats.dto";
import type { UpdateIncomeDto } from "../dtos/update-income.dto";
import { IncomeRepository } from "../income.repository";

@Injectable()
export class IncomeService {
  constructor(private readonly repo: IncomeRepository) {}

  findAll(filter: FilterIncomeDto) {
    return this.repo.findAll(filter);
  }

  async findById(id: string) {
    return this.repo.findById(id);
  }

  async create(data: CreateIncomeDto, userId: string) {
    return this.repo.create({
      name: data.name,
      amount: data.amount,
      incomeType: data.incomeType,
      receivedAt: data.receivedAt,
      status: data.status,
      user: { connect: { id: userId } },
      category: { connect: { id: data.categoryId } },
      paymentMethod: { connect: { id: data.paymentMethodId } },
    });
  }

  async update(id: string, data: UpdateIncomeDto) {
    const { categoryId, paymentMethodId, ...updateData } = data;

    return this.repo.update(id, {
      ...updateData,
      ...(categoryId && { category: { connect: { id: categoryId } } }),
      ...(paymentMethodId && {
        paymentMethod: { connect: { id: paymentMethodId } },
      }),
    });
  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  async getMonthlyStats(
    filter: MonthlyStatsDto
  ): Promise<MonthlyStatsResponseDto> {
    let month = filter.month;

    if (!month) {
      const now = new Date();
      const year = now.getFullYear();
      const monthNum = (now.getMonth() + 1).toString().padStart(2, "0");
      month = `${year}-${monthNum}`;
    }

    return this.repo.getMonthlyStats(month);
  }
}
