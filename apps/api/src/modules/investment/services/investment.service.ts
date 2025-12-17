import { Injectable } from "@nestjs/common";
import type { CreateInvestmentDto } from "../dtos/create-investment.dto";
import { FilterInvestmentDto } from "../dtos/filter-investment.dto";
import type {
  MonthlyStatsDto,
  MonthlyStatsResponseDto,
} from "../dtos/monthly-stats.dto";
import type { UpdateInvestmentDto } from "../dtos/update-investment.dto";
import { InvestmentRepository } from "../investment.repository";

@Injectable()
export class InvestmentService {
  constructor(private readonly repo: InvestmentRepository) {}

  findAll(filter: FilterInvestmentDto) {
    return this.repo.findAll(filter);
  }

  async create(data: CreateInvestmentDto, userId: string) {
    return this.repo.create({
      ...data,
      userId,
    });
  }

  async update(id: string, data: UpdateInvestmentDto) {
    const { categoryId, ...updateData } = data;

    return this.repo.update(id, {
      ...updateData,
      ...(categoryId && { category: { connect: { id: categoryId } } }),
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
