import { Injectable } from "@nestjs/common";
import { calculatePagination } from "@/utils/pagination.util";
import { PrismaService } from "@/utils/prisma.service";
import { FilterUserDto } from "./dtos/filter-user.dto";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: FilterUserDto) {
    const { init, limit, ...filters } = filter;

    const { pageSize, skip } = calculatePagination({ init, limit });

    // Tratamento do filtro emailVerified (string -> boolean)
    let emailVerifiedFilter: boolean | undefined;
    if (filters.emailVerified !== undefined) {
      emailVerifiedFilter = filters.emailVerified.toLowerCase() === "true";
    }

    const whereClause = {
      name: filters.name
        ? { contains: filters.name, mode: "insensitive" as const }
        : undefined,
      email: filters.email
        ? { contains: filters.email, mode: "insensitive" as const }
        : undefined,
      emailVerified: emailVerifiedFilter,
    };

    const findManyOptions = {
      where: whereClause,
      orderBy: { createdAt: "desc" as const },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        // Não incluir dados sensíveis como sessions e accounts
      },
      ...(pageSize && { skip, take: pageSize }),
    };

    const [data, totalLength] = await Promise.all([
      this.prisma.user.findMany(findManyOptions),
      this.prisma.user.count({
        where: whereClause,
      }),
    ]);

    return {
      data,
      totalLength,
    };
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        // Incluir contadores de dados relacionados
        _count: {
          select: {
            incomes: true,
            expenses: true,
            investments: true,
            sessions: true,
            accounts: true,
          },
        },
      },
    });
  }

  async getUserStats(id: string) {
    const [incomeStats, expenseStats, investmentStats] = await Promise.all([
      this.prisma.income.aggregate({
        where: { userId: id },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.expense.aggregate({
        where: { userId: id },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.investment.aggregate({
        where: { userId: id },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return {
      incomes: {
        total: incomeStats._sum.amount?.toNumber() || 0,
        count: incomeStats._count,
      },
      expenses: {
        total: expenseStats._sum.amount?.toNumber() || 0,
        count: expenseStats._count,
      },
      investments: {
        total: investmentStats._sum.amount?.toNumber() || 0,
        count: investmentStats._count,
      },
    };
  }
}
