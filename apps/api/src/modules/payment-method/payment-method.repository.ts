import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { calculatePagination } from "@/utils/pagination.util";
import { PrismaService } from "@/utils/prisma.service";
import { FilterPaymentMethodDto } from "./dtos/filter-payment-method.dto";

@Injectable()
export class PaymentMethodRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: FilterPaymentMethodDto) {
    const { init, limit, ...filters } = filter;

    const { pageSize, skip } = calculatePagination({ init, limit });

    let isActiveFilter: boolean | undefined;
    if (filters.isActive !== undefined) {
      isActiveFilter = filters.isActive.toLowerCase() === "true";
    }

    const whereClause = {
      name: filters.name
        ? { contains: filters.name, mode: "insensitive" as const }
        : undefined,
      isActive: isActiveFilter,
    };

    const findManyOptions = {
      where: whereClause,
      orderBy: { createdAt: "desc" as const },
      ...(pageSize && { skip, take: pageSize }),
    };

    const [data, totalLength] = await Promise.all([
      this.prisma.paymentMethod.findMany(findManyOptions),
      this.prisma.paymentMethod.count({
        where: whereClause,
      }),
    ]);

    return {
      data,
      totalLength,
    };
  }

  async create(data: Prisma.PaymentMethodCreateInput) {
    return this.prisma.paymentMethod.create({ data });
  }

  async findById(id: string) {
    return this.prisma.paymentMethod.findUnique({ where: { id } });
  }

  async findByName(name: string) {
    return this.prisma.paymentMethod.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  }

  async update(id: string, data: Prisma.PaymentMethodUpdateInput) {
    return this.prisma.paymentMethod.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.paymentMethod.delete({ where: { id } });
  }

  async checkIfPaymentMethodIsInUse(id: string) {
    const [incomeCount, expenseCount] = await Promise.all([
      this.prisma.income.count({
        where: { paymentMethodId: id },
      }),
      this.prisma.expense.count({
        where: { paymentMethodId: id },
      }),
    ]);

    return {
      isInUse: incomeCount > 0 || expenseCount > 0,
      incomeCount,
      expenseCount,
      totalCount: incomeCount + expenseCount,
    };
  }
}
