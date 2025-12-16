import {
  createEnumFilter,
  createRelationStringFilter,
} from "@/utils/filter.util";
import { calculatePagination } from "@/utils/pagination.util";
import { PrismaService } from "@/utils/prisma.service";
import { Injectable } from "@nestjs/common";
import type { ExpenseType, Prisma } from "@prisma/client";
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
    category: {
      id: string;
      name: string;
    };
    user: {
      id: string;
      name: string;
    };
    paymentMethod?: {
      id: string;
      name: string;
    };
    installments: Array<{
      id: string;
      amount: number;
      dueDate: Date;
      number: number;
      status: string;
    }>;
  }>;
  totalLength: number;
}

interface ExpenseResponse {
  id: string;
  name: string;
  amount: number;
  status: string;
  spentAt: Date;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
  };
  paymentMethod?: {
    id: string;
    name: string;
  };
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
    const { pageSize, skip } = calculatePagination({
      init: filter.init,
      limit: filter.limit,
    });

    // Processar filtros de enum
    const expenseTypeCondition = createEnumFilter<ExpenseType>(
      filter.expenseType
    );
    const statusCondition = createEnumFilter<ExpenseStatus>(filter.status);

    // Processar filtros de relação
    const categoryFilter = createRelationStringFilter(filter.category);
    const paymentMethodFilter = createRelationStringFilter(
      filter.paymentMethod
    );

    const whereClause = {
      name: filter.description
        ? { contains: filter.description, mode: "insensitive" as const }
        : undefined,
      amount: filter.amount,
      paymentMethod: paymentMethodFilter,
      status: statusCondition,
      expenseType: expenseTypeCondition,
      spentAt: filter.date
        ? {
            gte: new Date(`${filter.date}T00:00:00.000Z`),
            lt: new Date(`${filter.date}T23:59:59.999Z`),
          }
        : undefined,
      userId: filter.userId,
      category: categoryFilter,
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

    const data = rawData.map((expense) => ({
      ...expense,
      amount: expense.amount.toNumber(),
      user: {
        id: expense.userId,
        name: expense.user.name,
      },
      category: {
        id: expense.categoryId,
        name: expense.category.name,
      },
      paymentMethod: {
        id: expense.paymentMethodId,
        name: expense.paymentMethod.name,
      },
      installments: expense.installments.map((installment) => ({
        ...installment,
        amount: installment.amount.toNumber(),
      })),
    }));

    return {
      data,
      totalLength,
    };
  }

  async create(data: Prisma.ExpenseCreateInput): Promise<ExpenseResponse> {
    const expense = await this.prisma.expense.create({
      data,
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

    return {
      ...expense,
      amount: expense.amount.toNumber(),
      user: {
        id: expense.userId,
        name: expense.user.name,
      },
      category: {
        id: expense.categoryId,
        name: expense.category.name,
      },
      paymentMethod: {
        id: expense.paymentMethodId,
        name: expense.paymentMethod.name,
      },
      installments: expense.installments.map((installment) => ({
        ...installment,
        amount: installment.amount.toNumber(),
      })),
    };
  }

  async findById(id: string): Promise<ExpenseResponse> {
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

    return {
      ...expense,
      amount: expense.amount.toNumber(),
      user: {
        id: expense.userId,
        name: expense.user.name,
      },
      category: {
        id: expense.categoryId,
        name: expense.category.name,
      },
      paymentMethod: {
        id: expense.paymentMethodId,
        name: expense.paymentMethod.name,
      },
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
    const expense = await this.prisma.expense.update({
      where: { id },
      data,
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

    return {
      ...expense,
      amount: expense.amount.toNumber(),
      user: {
        id: expense.userId,
        name: expense.user.name,
      },
      category: {
        id: expense.categoryId,
        name: expense.category.name,
      },
      paymentMethod: {
        id: expense.paymentMethodId,
        name: expense.paymentMethod.name,
      },
      installments: expense.installments.map((installment) => ({
        ...installment,
        amount: installment.amount.toNumber(),
      })),
    };
  }

  async delete(id: string): Promise<ExpenseResponse> {
    const expense = await this.prisma.expense.delete({
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
        },
      },
    });

    return {
      ...expense,
      amount: expense.amount.toNumber(),
      user: {
        id: expense.userId,
        name: expense.user.name,
      },
      category: {
        id: expense.categoryId,
        name: expense.category.name,
      },
      paymentMethod: {
        id: expense.paymentMethodId,
        name: expense.paymentMethod.name,
      },
      installments: expense.installments.map((installment) => ({
        ...installment,
        amount: installment.amount.toNumber(),
      })),
    };
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
}
