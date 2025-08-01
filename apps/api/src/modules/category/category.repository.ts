import { PrismaService } from "@/utils/prisma.service";
import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { FilterCategoryDto } from "./dtos/filter-category.dto";

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: FilterCategoryDto) {
    const { init, limit, ...filters } = filter;

    const page = Number(init) || 0;
    const pageSize = limit ? Number(limit) : undefined;
    const skip = pageSize ? page * pageSize : undefined;

    const whereClause = {
      name: filters.name
        ? { contains: filters.name, mode: "insensitive" as const }
        : undefined,
      type: filters.type,
    };

    const findManyOptions = {
      where: whereClause,
      orderBy: { createdAt: "desc" as const },
      ...(pageSize && { skip, take: pageSize }),
    };

    const [rawData, totalLength] = await Promise.all([
      this.prisma.category.findMany(findManyOptions),
      this.prisma.category.count({
        where: whereClause,
      }),
    ]);

    return {
      data: rawData,
      totalLength,
    };
  }

  async create(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({ data });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }

  async findByNameAndType(
    name: string,
    type: "INCOME" | "EXPENSE" | "INVESTMENT"
  ) {
    return this.prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        type,
      },
    });
  }
}
