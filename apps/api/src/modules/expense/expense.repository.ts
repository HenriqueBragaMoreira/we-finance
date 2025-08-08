import { Injectable } from "@nestjs/common";
import type { ExpenseType, Prisma } from "@prisma/client";
import { PrismaService } from "@/utils/prisma.service";
import { FilterExpenseDto } from "./dtos/filter-expense.dto";

// Import ExpenseStatus from the DTO file
enum ExpenseStatus {
  PENDING = "PENDING",
  PAID = "PAID",
}

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

interface ExpenseResponse {
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
}

export type { ExpenseListResponse, ExpenseResponse };

@Injectable()
export class ExpenseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: FilterExpenseDto): Promise<ExpenseListResponse> {
    const page = Number(filter.init) || 0;
    const pageSize = filter.limit ? Number(filter.limit) : undefined;
    const skip = pageSize ? page * pageSize : undefined;

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

    let statusCondition: ExpenseStatus | { in: ExpenseStatus[] } | undefined;
    if (filter.status) {
      const statuses = filter.status.split(",").map((status) => status.trim());
      if (statuses.length === 1) {
        statusCondition = statuses[0] as ExpenseStatus;
      } else {
        statusCondition = { in: statuses as ExpenseStatus[] };
      }
    }

    const whereClause = {
      name: filter.description
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
      status: statusCondition,
      expenseType: expenseTypeCondition,
      spentAt: filter.date
        ? {
            gte: new Date(`${filter.date}T00:00:00.000Z`),
            lt: new Date(`${filter.date}T23:59:59.999Z`),
          }
        : undefined,
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

  async create(data: Prisma.ExpenseCreateInput): Promise<ExpenseResponse> {
    const expense = await this.prisma.expense.create({ data });
    return this.findOneWithRelations(expense.id);
  }

  async findById(id: string): Promise<ExpenseResponse> {
    return this.findOneWithRelations(id);
  }

  private async findOneWithRelations(id: string): Promise<ExpenseResponse> {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
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
            number: "asc",
          },
        },
      },
    });

    if (!expense) {
      throw new Error("Expense not found");
    }

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
  }

  async update(
    id: string,
    data: Prisma.ExpenseUpdateInput
  ): Promise<ExpenseResponse> {
    await this.prisma.expense.update({ where: { id }, data });
    return this.findOneWithRelations(id);
  }

  async delete(id: string): Promise<ExpenseResponse> {
    return this.prisma.$transaction(async (prisma) => {
      // Primeiro, buscar os dados da expense antes de excluir
      const expenseToDelete = await this.findOneWithRelations(id);

      // Excluir todos os installments associados à expense
      await prisma.installment.deleteMany({
        where: { expenseId: id },
      });

      // Excluir a expense
      await prisma.expense.delete({
        where: { id },
      });

      // Retornar os dados da expense que foi excluída
      return expenseToDelete;
    });
  }

  async getMonthlyStats(month: string) {
    const [year, monthNum] = month.split("-").map(Number);

    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 1);

    // Total de despesas de todos os usuários no mês
    const result = await this.prisma.expense.aggregate({
      where: {
        spentAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Total pago de todos os usuários no mês
    const paidResult = await this.prisma.expense.aggregate({
      where: {
        status: "PAID",
        spentAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Total pendente de todos os usuários no mês
    const pendingResult = await this.prisma.expense.aggregate({
      where: {
        status: "PENDING",
        spentAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const totalExpenses = result._sum.amount?.toNumber() || 0;
    const paid = paidResult._sum.amount?.toNumber() || 0;
    const pending = pendingResult._sum.amount?.toNumber() || 0;

    return {
      totalExpenses,
      paid,
      pending,
      month,
    };
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
