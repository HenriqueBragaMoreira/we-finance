import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/utils/prisma.service";
import { FilterIncomeDto } from "./dtos/filter-income.dto";

@Injectable()
export class IncomeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: FilterIncomeDto) {
    const { init, limit, ...filters } = filter;

    return this.prisma.income.findMany({
      where: {
        name: filters.description
          ? { contains: filters.description, mode: "insensitive" }
          : undefined,
        type: filters.type,
        amount: filters.amount,
        paymentMethod: filters.paymentMethod,
        status: filters.status,
        createdAt: filters.date ? new Date(filters.date) : undefined,
        userId: filters.userId,
      },
      orderBy: { createdAt: "desc" },
      skip: Number(init) || 0,
      take: Number(limit) || 10,
    });
  }
}
