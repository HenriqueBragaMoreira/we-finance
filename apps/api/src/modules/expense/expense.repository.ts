import { Injectable } from "@nestjs/common";
import type { ExpenseType, Prisma } from "@prisma/client";
import { PrismaService } from "@/utils/prisma.service";
import { FilterExpenseDto } from "./dtos/filter-expense.dto";

interface ExpenseListResponse {
  data: Array<{
    id: string;
    name: string;
    amount: number;
    status: string;
    spentAt: Date;
    createdAt: Date;
    updatedAt: Date;
    category: string;
    user: string;
    paymentMethod?: string;
    installments: Array<{
      id: string;
      amount: number;
      dueDate: Date;
      number: number;
      status: string;
    }>;
  }>;
  total: number;
  count: number;
}

export type { ExpenseListResponse };

@Injectable()
export class ExpenseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: FilterExpenseDto): Promise<ExpenseListResponse> {
    const page = Number(filter.init) || 0;
    const pageSize = filter.limit ? Number(filter.limit) : undefined;
    const skip = pageSize ? page * pageSize : undefined;

    // Tratamento do filtro expenseType
    let expenseTypeCondition: ExpenseType | { in: ExpenseType[] } | undefined;
    if (filter.expenseType) {
      const expenseTypes = filter.expenseType
        .split(",")
        .map((type) => type.trim()) as ExpenseType[];
      if (expenseTypes.length === 1) {
        expenseTypeCondition = expenseTypes[0];
      } else {
        expenseTypeCondition = { in: expenseTypes };
      }
    }

    const whereClause = {
      description: filter.description
        ? { contains: filter.description, mode: "insensitive" as const }
        : undefined,
      amount: filter.amount,
      paymentMethod: filter.paymentMethod
        ? {
            name: {
              contains: filter.paymentMethod,
              mode: "insensitive" as const,
            },
          }
        : undefined,
      status: filter.status,
      expenseType: expenseTypeCondition,
      spentAt: filter.date ? new Date(filter.date) : undefined,
      userId: filter.userId,
      category: filter.category
        ? {
            OR: filter.category.split(",").map((categoryName) => ({
              name: {
                contains: categoryName.trim(),
                mode: "insensitive" as const,
              },
            })),
          }
        : undefined,
    };

    const findManyOptions = {
      where: whereClause,
      orderBy: { createdAt: "desc" as const },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        paymentMethod: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
        installments: {
          select: {
            id: true,
            amount: true,
            dueDate: true,
            number: true,
            status: true,
          },
          orderBy: {
            number: "asc" as const,
          },
        },
      },
      ...(pageSize && { skip, take: pageSize }),
    };

    const [rawData, totalLength] = await Promise.all([
      this.prisma.expense.findMany(findManyOptions),
      this.prisma.expense.count({
        where: whereClause,
      }),
    ]);

    const data = rawData.map((expense) => {
      const {
        categoryId: _,
        userId: __,
        paymentMethodId: ___,
        category,
        user,
        paymentMethod,
        ...rest
      } = expense;
      return {
        ...rest,
        amount: expense.amount.toNumber(),
        user: user.name,
        category: category.name,
        paymentMethod: paymentMethod?.name,
        installments: expense.installments.map((installment) => ({
          ...installment,
          amount: installment.amount.toNumber(),
        })),
      };
    });

    return {
      data,
      total: totalLength,
      count: data.length,
    };
  }

  async create(data: Prisma.ExpenseCreateInput) {
    return this.prisma.expense.create({ data });
  }

  async update(id: string, data: Prisma.ExpenseUpdateInput) {
    return this.prisma.expense.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.expense.delete({ where: { id } });
  }

  async findOrCreateCategory(
    name: string,
    type: "INCOME" | "EXPENSE" | "INVESTMENT"
  ) {
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        type,
      },
    });

    if (existingCategory) {
      return existingCategory;
    }

    return this.prisma.category.create({
      data: {
        name,
        type,
      },
    });
  }

  async findOrCreatePaymentMethod(name: string) {
    const existingPaymentMethod = await this.prisma.paymentMethod.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existingPaymentMethod) {
      return existingPaymentMethod;
    }

    return this.prisma.paymentMethod.create({
      data: {
        name,
      },
    });
  }
}
