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

  async create(data: CreateIncomeDto, userId: string) {
    const category = await this.repo.findOrCreateCategory(
      data.category,
      "INCOME"
    );

    return this.repo.create({
      ...data,
      user: { connect: { id: userId } },
      category: { connect: { id: category.id } },
    });
  }

  update(id: string, data: UpdateIncomeDto) {
    const { categoryId, ...updateData } = data;

    return this.repo.update(id, {
      ...updateData,
      category: { connect: { id: categoryId } },
    });
  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  async getMonthlyStats(
    userId: string,
    filter: MonthlyStatsDto
  ): Promise<MonthlyStatsResponseDto> {
    // Se não foi passado mês, usa o mês atual
    let month = filter.month;
    if (!month) {
      const now = new Date();
      const year = now.getFullYear();
      const monthNum = (now.getMonth() + 1).toString().padStart(2, "0");
      month = `${year}-${monthNum}`;
    }

    return this.repo.getMonthlyStats(userId, month);
  }
}
