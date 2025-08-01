import { PrismaService } from "@/utils/prisma.service";
import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { FilterIncomeDto } from "./dtos/filter-income.dto";

@Injectable()
export class IncomeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: FilterIncomeDto) {
    const { init, limit, ...filters } = filter;

    const page = Number(init) || 0;
    const pageSize = limit ? Number(limit) : undefined;
    const skip = pageSize ? page * pageSize : undefined;

    const whereClause = {
      name: filters.description
        ? { contains: filters.description, mode: "insensitive" as const }
        : undefined,
      type: filters.type,
      amount: filters.amount,
      paymentMethod: filters.paymentMethod,
      status: filters.status,
      createdAt: filters.date ? new Date(filters.date) : undefined,
      userId: filters.userId,
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
      this.prisma.income.findMany(findManyOptions),
      this.prisma.income.count({
        where: whereClause,
      }),
    ]);

    console.log("Raw Data:", rawData);

    const data = rawData.map((income) => {
      const { categoryId: _, userId: __, category, user, ...rest } = income;
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

  async create(data: Prisma.IncomeCreateInput) {
    return this.prisma.income.create({ data });
  }

  async findById(id: string) {
    return this.prisma.income.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.IncomeUpdateInput) {
    return this.prisma.income.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.income.delete({ where: { id } });
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
