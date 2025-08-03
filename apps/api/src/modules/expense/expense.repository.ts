import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "@/utils/prisma.service";
import { FilterExpenseDto } from "./dtos/filter-expense.dto";

@Injectable()
export class ExpenseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: FilterExpenseDto) {
    const { init, limit, ...filters } = filter;

    const page = Number(init) || 0;
    const pageSize = limit ? Number(limit) : undefined;
    const skip = pageSize ? page * pageSize : undefined;

    const whereClause = {
      name: filters.description
        ? { contains: filters.description, mode: "insensitive" as const }
        : undefined,
      amount: filters.amount,
      paymentMethod: filters.paymentMethod,
      status: filters.status,
      spentAt: filters.date ? new Date(filters.date) : undefined,
      userId: filters.userId,
      category: filters.category
        ? { name: { contains: filters.category, mode: "insensitive" as const } }
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
      const { categoryId: _, userId: __, category, user, ...rest } = expense;
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
}
