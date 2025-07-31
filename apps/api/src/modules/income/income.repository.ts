import { PrismaService } from "@/utils/prisma.service";
import { Injectable } from "@nestjs/common";
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
      ...(pageSize && { skip, take: pageSize }),
    };

    const [data, totalLength] = await Promise.all([
      this.prisma.income.findMany(findManyOptions),
      this.prisma.income.count({
        where: whereClause,
      }),
    ]);

    return {
      data,
      totalLength,
    };
  }
}
