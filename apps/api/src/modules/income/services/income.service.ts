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
    const income = await this.repo.findById(id);

    if (!income) {
      return null;
    }

    const {
      categoryId: _,
      userId: __,
      paymentMethodId: ___,
      category,
      user,
      paymentMethod,
      ...rest
    } = income;

    return {
      ...rest,
      amount: income.amount.toNumber(),
      user: user?.name,
      category: category?.name,
      paymentMethod: paymentMethod?.name,
    };
  }

  async create(data: CreateIncomeDto, userId: string) {
    const category = await this.repo.findOrCreateCategory(
      data.category,
      "INCOME"
    );

    const paymentMethod = await this.repo.findOrCreatePaymentMethod(
      data.paymentMethod
    );

    const createdIncome = await this.repo.create({
      name: data.name,
      amount: data.amount,
      incomeType: data.incomeType,
      receivedAt: data.receivedAt,
      status: data.status,
      user: { connect: { id: userId } },
      category: { connect: { id: category.id } },
      paymentMethod: { connect: { id: paymentMethod.id } },
    });

    return this.findById(createdIncome.id);
  }

  async update(id: string, data: UpdateIncomeDto) {
    const { category, paymentMethod, ...updateData } = data;

    let categoryConnect: { connect: { id: string } } | undefined;
    if (category) {
      const foundCategory = await this.repo.findOrCreateCategory(
        category,
        "INCOME"
      );
      categoryConnect = { connect: { id: foundCategory.id } };
    }

    let paymentMethodConnect: { connect: { id: string } } | undefined;
    if (paymentMethod) {
      const foundPaymentMethod =
        await this.repo.findOrCreatePaymentMethod(paymentMethod);
      paymentMethodConnect = { connect: { id: foundPaymentMethod.id } };
    }

    await this.repo.update(id, {
      ...updateData,
      ...(categoryConnect && { category: categoryConnect }),
      ...(paymentMethodConnect && { paymentMethod: paymentMethodConnect }),
    });

    return this.findById(id);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }

  async getMonthlyStats(
    userId: string,
    filter: MonthlyStatsDto
  ): Promise<MonthlyStatsResponseDto> {
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
