import { Injectable } from "@nestjs/common";
import type { CreateExpenseDto } from "../dtos/create-expense.dto";
import { FilterExpenseDto } from "../dtos/filter-expense.dto";
import type {
  MonthlyStatsDto,
  MonthlyStatsResponseDto,
} from "../dtos/monthly-stats.dto";
import type { UpdateExpenseDto } from "../dtos/update-expense.dto";
import {
  type ExpenseListResponse,
  ExpenseRepository,
} from "../expense.repository";

@Injectable()
export class ExpenseService {
  constructor(private readonly repo: ExpenseRepository) {}

  findAll(filter: FilterExpenseDto): Promise<ExpenseListResponse> {
    return this.repo.findAll(filter);
  }

  async create(data: CreateExpenseDto, userId: string) {
    const category = await this.repo.findOrCreateCategory(
      data.category,
      "EXPENSE"
    );

    const paymentMethod = await this.repo.findOrCreatePaymentMethod(
      data.paymentMethod
    );

    const { installmentsCount } = data;

    // Certificar que o expenseType está incluído
    const expenseCreateData = {
      name: data.name,
      amount: data.amount,
      expenseType: data.expenseType,
      spentAt: data.spentAt,
      status: data.status,
    };

    const hasInstallments = installmentsCount && installmentsCount > 1;

    if (hasInstallments) {
      const installmentAmount = Number(
        (data.amount / installmentsCount).toFixed(2)
      );

      const lastInstallmentAmount = Number(
        (data.amount - installmentAmount * (installmentsCount - 1)).toFixed(2)
      );

      const installments = Array.from(
        { length: installmentsCount },
        (_, index) => {
          const installmentNumber = index + 1;
          const amount =
            installmentNumber === installmentsCount
              ? lastInstallmentAmount
              : installmentAmount;

          const dueDate = new Date(data.spentAt);
          dueDate.setMonth(dueDate.getMonth() + index);

          return {
            number: installmentNumber,
            amount,
            dueDate,
            status: "PENDING" as const,
          };
        }
      );

      return this.repo.create({
        ...expenseCreateData,
        user: { connect: { id: userId } },
        category: { connect: { id: category.id } },
        paymentMethod: { connect: { id: paymentMethod.id } },
        installments: {
          create: installments,
        },
      });
    }

    return this.repo.create({
      ...expenseCreateData,
      user: { connect: { id: userId } },
      category: { connect: { id: category.id } },
      paymentMethod: { connect: { id: paymentMethod.id } },
    });
  }

  async update(id: string, data: UpdateExpenseDto) {
    const { categoryId, paymentMethod, ...updateData } = data;

    const updatePayload: Record<string, unknown> = { ...updateData };

    if (categoryId) {
      updatePayload.category = { connect: { id: categoryId } };
    }

    if (paymentMethod) {
      const paymentMethodRecord =
        await this.repo.findOrCreatePaymentMethod(paymentMethod);
      updatePayload.paymentMethod = { connect: { id: paymentMethodRecord.id } };
    }

    return this.repo.update(id, updatePayload);
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
