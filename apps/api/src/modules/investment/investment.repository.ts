import { PrismaService } from "@/utils/prisma.service";
import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { FilterInvestmentDto } from "./dtos/filter-investment.dto";

@Injectable()
export class InvestmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: FilterInvestmentDto) {
    const { init, limit, ...filters } = filter;

    const page = Number(init) || 0;
    const pageSize = limit ? Number(limit) : undefined;
    const skip = pageSize ? page * pageSize : undefined;

    const whereClause = {
      amount: filters.amount,
      investedAt: filters.investedAt ? new Date(filters.investedAt) : undefined,
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
    return this.prisma.investment.create({ data });
  }

  async update(id: string, data: Prisma.InvestmentUpdateInput) {
    return this.prisma.investment.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.investment.delete({ where: { id } });
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
}
