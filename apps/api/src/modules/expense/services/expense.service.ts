import { Injectable } from "@nestjs/common";
import type { CreateExpenseDto } from "../dtos/create-expense.dto";
import { FilterExpenseDto } from "../dtos/filter-expense.dto";
import type { UpdateExpenseDto } from "../dtos/update-expense.dto";
import { ExpenseRepository } from "../expense.repository";

@Injectable()
export class ExpenseService {
  constructor(private readonly repo: ExpenseRepository) {}

  findAll(filter: FilterExpenseDto) {
    return this.repo.findAll(filter);
  }

  async create(data: CreateExpenseDto, userId: string) {
    const category = await this.repo.findOrCreateCategory(
      data.category,
      "EXPENSE"
    );

    const { installmentsCount, ...expenseData } = data;

    const isInstallment = installmentsCount && installmentsCount > 1;

    if (isInstallment) {
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
        ...expenseData,
        isInstallment: true,
        user: { connect: { id: userId } },
        category: { connect: { id: category.id } },
        installments: {
          create: installments,
        },
      });
    }

    return this.repo.create({
      ...expenseData,
      isInstallment: false,
      user: { connect: { id: userId } },
      category: { connect: { id: category.id } },
    });
  }

  async update(id: string, data: UpdateExpenseDto) {
    const { categoryId, ...updateData } = data;

    return this.repo.update(id, {
      ...updateData,
      ...(categoryId && { category: { connect: { id: categoryId } } }),
    });
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
