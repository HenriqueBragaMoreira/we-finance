import { Injectable } from "@nestjs/common";
import type { IncomeStatus, IncomeType, Prisma } from "@prisma/client";
import { PrismaService } from "@/utils/prisma.service";
import { FilterIncomeDto } from "./dtos/filter-income.dto";

@Injectable()
export class IncomeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: FilterIncomeDto) {
    const { init, limit, ...filters } = filter;

    const page = Number(init) || 0;
    const pageSize = limit ? Number(limit) : undefined;
    const skip = pageSize ? page * pageSize : undefined;

    let categoryFilter: Prisma.CategoryWhereInput | undefined;

    if (filters.category) {
      const categories = filters.category.split(",").map((cat) => cat.trim());
      if (categories.length === 1) {
        categoryFilter = {
          name: { contains: categories[0], mode: "insensitive" },
        };
      } else {
        categoryFilter = {
          OR: categories.map((cat) => ({
            name: { contains: cat, mode: "insensitive" as const },
          })),
        };
      }
    }

    let statusCondition: IncomeStatus | { in: IncomeStatus[] } | undefined;
    if (filters.status) {
      const statuses = filters.status.split(",").map((status) => status.trim());
      if (statuses.length === 1) {
        statusCondition = statuses[0] as IncomeStatus;
      } else {
        statusCondition = { in: statuses as IncomeStatus[] };
      }
    }

    let paymentMethodCondition: Prisma.PaymentMethodWhereInput | undefined;
    if (filters.paymentMethod) {
      const paymentMethods = filters.paymentMethod
        .split(",")
        .map((method) => method.trim());
      if (paymentMethods.length === 1) {
        paymentMethodCondition = {
          name: { contains: paymentMethods[0], mode: "insensitive" },
        };
      } else {
        paymentMethodCondition = {
          OR: paymentMethods.map((method) => ({
            name: { contains: method, mode: "insensitive" as const },
          })),
        };
      }
    }

    let incomeTypeCondition: IncomeType | { in: IncomeType[] } | undefined;
    if (filters.incomeType) {
      const incomeTypes = filters.incomeType
        .split(",")
        .map((type) => type.trim()) as IncomeType[];
      if (incomeTypes.length === 1) {
        incomeTypeCondition = incomeTypes[0];
      } else {
        incomeTypeCondition = { in: incomeTypes };
      }
    }

    const whereClause = {
      name: filters.description
        ? { contains: filters.description, mode: "insensitive" as const }
        : undefined,
      category: categoryFilter,
      amount: filters.amount,
      paymentMethod: paymentMethodCondition,
      status: statusCondition,
      incomeType: incomeTypeCondition,
      receivedAt: filters.date
        ? {
            gte: new Date(`${filters.date}T00:00:00.000Z`),
            lt: new Date(
              new Date(`${filters.date}T00:00:00.000Z`).getTime() +
                24 * 60 * 60 * 1000
            ),
          }
        : undefined,
      userId: filters.userId,
    };

    const findManyOptions = {
      where: whereClause,
      orderBy: [
        { receivedAt: "desc" as const },
        { createdAt: "desc" as const },
      ],
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
      },
      ...(pageSize && { skip, take: pageSize }),
    };

    const [rawData, totalLength] = await Promise.all([
      this.prisma.income.findMany(findManyOptions),
      this.prisma.income.count({
        where: whereClause,
      }),
    ]);

    const data = rawData.map((income) => {
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
        user: user.name,
        category: category.name,
        paymentMethod: paymentMethod.name,
      };
    });

    return {
      data,
      totalLength,
    };
  }

  async create(data: Prisma.IncomeCreateInput) {
    return this.prisma.income.create({ data });
  }

  async findById(id: string) {
    return this.prisma.income.findUnique({
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
      },
    });
  }

  async update(id: string, data: Prisma.IncomeUpdateInput) {
    return this.prisma.income.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.income.delete({ where: { id } });
  }

  async findOrCreateCategory(
    name: string,
    type: "INCOME" | "EXPENSE" | "INVESTMENT",
    color?: string
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
        color: color || "",
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

  async getMonthlyStats(month: string) {
    const [year, monthNum] = month.split("-").map(Number);

    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 1);

    // Total de receitas de todos os usuários no mês
    const result = await this.prisma.income.aggregate({
      where: {
        receivedAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Total recebido de todos os usuários no mês
    const receivedResult = await this.prisma.income.aggregate({
      where: {
        status: "RECEIVED",
        receivedAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Total pendente de todos os usuários no mês
    const pendingResult = await this.prisma.income.aggregate({
      where: {
        status: "PENDING",
        receivedAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const totalRevenues = result._sum.amount?.toNumber() || 0;
    const received = receivedResult._sum.amount?.toNumber() || 0;
    const pending = pendingResult._sum.amount?.toNumber() || 0;

    return {
      totalRevenues,
      received,
      pending,
      month,
    };
  }
}
