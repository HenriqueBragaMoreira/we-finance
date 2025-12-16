import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { calculatePagination } from "@/utils/pagination.util";
import { PrismaService } from "@/utils/prisma.service";
import { FilterInvestmentDto } from "./dtos/filter-investment.dto";

@Injectable()
export class InvestmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: FilterInvestmentDto) {
    const { init, limit, ...filters } = filter;

    const { pageSize, skip } = calculatePagination({ init, limit });

    const whereClause = {
      amount: filters.amount,
      investedAt: filters.investedAt
        ? {
            gte: new Date(`${filter.investedAt}T00:00:00.000Z`),
            lt: new Date(`${filter.investedAt}T23:59:59.999Z`),
          }
        : undefined,
      notes: filters.notes
        ? { contains: filters.notes, mode: "insensitive" as const }
        : undefined,
      userId: filters.userId,
      categoryId: filters.categoryId,
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
        user: {
          select: {
            name: true,
          },
        },
      },
      ...(pageSize && { skip, take: pageSize }),
    };

    const [rawData, totalLength] = await Promise.all([
      this.prisma.investment.findMany(findManyOptions),
      this.prisma.investment.count({
        where: whereClause,
      }),
    ]);

    const data = rawData.map((investment) => {
      const { categoryId: _, userId: __, category, user, ...rest } = investment;
      return {
        ...rest,
        user: user.name,
        category: category.name,
      };
    });

    return {
      data,
      totalLength,
    };
  }

  async create(data: Prisma.InvestmentCreateInput) {
    const investment = await this.prisma.investment.create({
      data,
      include: {
        category: {
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

    const { categoryId: _, userId: __, category, user, ...rest } = investment;
    return {
      ...rest,
      user: user.name,
      category: category.name,
    };
  }

  async update(id: string, data: Prisma.InvestmentUpdateInput) {
    const investment = await this.prisma.investment.update({
      where: { id },
      data,
      include: {
        category: {
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

    const { categoryId: _, userId: __, category, user, ...rest } = investment;
    return {
      ...rest,
      user: user.name,
      category: category.name,
    };
  }

  async delete(id: string) {
    const investment = await this.prisma.investment.delete({
      where: { id },
      include: {
        category: {
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

    const { categoryId: _, userId: __, category, user, ...rest } = investment;
    return {
      ...rest,
      user: user.name,
      category: category.name,
    };
  }

  async getMonthlyStats(month: string) {
    const [year, monthNum] = month.split("-").map(Number);

    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 1);

    const userInvestments = await this.prisma.investment.groupBy({
      by: ["userId"],
      where: {
        investedAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const userIds = userInvestments.map((inv) => inv.userId);
    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const userStats = userInvestments.map((inv) => {
      const user = users.find((u) => u.id === inv.userId);
      return {
        name: user?.name || "Usuário não encontrado",
        amount: inv._sum.amount?.toNumber() || 0,
      };
    });

    const totalInvestments = userStats.reduce(
      (sum, user) => sum + user.amount,
      0
    );

    return {
      totalInvestments,
      month,
      userStats,
    };
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
}
