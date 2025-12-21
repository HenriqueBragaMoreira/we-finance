import { Injectable } from "@nestjs/common";
import type { CreateExpenseDto } from "../dtos/create-expense.dto";
import { FilterExpenseDto } from "../dtos/filter-expense.dto";
import type {
  MonthlyStatsDto,
  MonthlyStatsResponseDto,
} from "../dtos/monthly-stats.dto";
import type { UpdateExpenseDto } from "../dtos/update-expense.dto";
import type { UpdateInstallmentDto } from "../dtos/update-installment.dto";
import {
  type ExpenseListResponse,
  ExpenseRepository,
  type ExpenseResponse,
} from "../expense.repository";

@Injectable()
export class ExpenseService {
  constructor(private readonly repo: ExpenseRepository) {}

  findAll(filter: FilterExpenseDto): Promise<ExpenseListResponse> {
    return this.repo.findAll(filter);
  }

  async create(
    data: CreateExpenseDto,
    userId: string
  ): Promise<ExpenseResponse> {
    const { installmentsCount } = data;

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
        category: { connect: { id: data.categoryId } },
        paymentMethod: { connect: { id: data.paymentMethodId } },
        installments: {
          create: installments,
        },
      });
    }

    return this.repo.create({
      ...expenseCreateData,
      user: { connect: { id: userId } },
      category: { connect: { id: data.categoryId } },
      paymentMethod: { connect: { id: data.paymentMethodId } },
    });
  }

  async update(id: string, data: UpdateExpenseDto): Promise<ExpenseResponse> {
    const { categoryId, paymentMethodId, installmentsCount, ...updateData } =
      data;

    const updatePayload: Record<string, unknown> = { ...updateData };

    if (categoryId) {
      updatePayload.category = { connect: { id: categoryId } };
    }

    if (paymentMethodId) {
      updatePayload.paymentMethod = { connect: { id: paymentMethodId } };
    }

    // Se installmentsCount foi fornecido, precisamos recriar os installments
    if (installmentsCount !== undefined && installmentsCount > 0) {
      const hasInstallments = installmentsCount > 1;

      if (hasInstallments) {
        // Buscar os dados atuais da expense se amount ou spentAt não foram fornecidos
        let amount = updateData.amount;
        let spentAt = updateData.spentAt;

        if (!amount || !spentAt) {
          const currentExpense = await this.repo.findById(id);
          amount = amount || currentExpense.amount;
          spentAt = spentAt || currentExpense.spentAt;
        }

        const installmentAmount = Number(
          (amount / installmentsCount).toFixed(2)
        );

        const lastInstallmentAmount = Number(
          (amount - installmentAmount * (installmentsCount - 1)).toFixed(2)
        );

        const installments = Array.from(
          { length: installmentsCount },
          (_, index) => {
            const installmentNumber = index + 1;
            const installmentAmountValue =
              installmentNumber === installmentsCount
                ? lastInstallmentAmount
                : installmentAmount;

            const dueDate = new Date(spentAt);
            dueDate.setMonth(dueDate.getMonth() + index);

            return {
              number: installmentNumber,
              amount: installmentAmountValue,
              dueDate,
              status: "PENDING" as const,
            };
          }
        );

        // Primeiro deletar todos os installments existentes, depois recriar
        updatePayload.installments = {
          deleteMany: {},
          create: installments,
        };
      } else {
        // Se installmentsCount for 1 ou 0, remover todos os installments
        updatePayload.installments = {
          deleteMany: {},
        };
      }
    }

    return this.repo.update(id, updatePayload);
  }

  delete(id: string): Promise<ExpenseResponse> {
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

  async updateInstallment(
    id: string,
    data: UpdateInstallmentDto
  ): Promise<{
    id: string;
    amount: number;
    dueDate: Date;
    number: number;
    status: string;
  }> {
    return this.repo.updateInstallment(id, data);
  }
}
