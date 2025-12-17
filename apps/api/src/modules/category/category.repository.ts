import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import {
  createBooleanFilter,
  createBooleanOrConditions,
  createDateRangeFilter,
  createEnumFilter,
  createStringFilter,
  createStringOrConditions,
} from "@/utils/filter.util";
import { calculatePagination } from "@/utils/pagination.util";
import { PrismaService } from "@/utils/prisma.service";
import { FilterCategoryDto } from "./dtos/filter-category.dto";

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: FilterCategoryDto) {
    const { init, limit, ...filters } = filter;

    const { pageSize, skip } = calculatePagination({ init, limit });

    // Processar filtros simples
    const nameCondition = createStringFilter(filters.name);
    const typeCondition = createEnumFilter<"INCOME" | "EXPENSE" | "INVESTMENT">(
      filters.type
    );
    const statusCondition = createBooleanFilter(filters.status);
    const isActiveCondition = createBooleanFilter(filters.isActive);
    const colorCondition = createStringFilter(filters.color);
    const createdAtCondition = createDateRangeFilter(filters.createdAt);
    const updatedAtCondition = createDateRangeFilter(filters.updatedAt);

    // Criar whereClause base
    const whereClause: Prisma.CategoryWhereInput = {
      name: nameCondition,
      type: typeCondition,
      isActive: isActiveCondition || statusCondition,
      color: colorCondition,
      createdAt: createdAtCondition,
      updatedAt: updatedAtCondition,
    };

    // Processar condições OR para múltiplos valores
    const nameOrConditions = createStringOrConditions(filters.name, "name");
    const colorOrConditions = createStringOrConditions(filters.color, "color");
    const statusOrConditions = createBooleanOrConditions(
      filters.status,
      "isActive"
    );
    const isActiveOrConditions = createBooleanOrConditions(
      filters.isActive,
      "isActive"
    );

    // Adicionar condições OR ao whereClause
    if (nameOrConditions.length > 0) {
      whereClause.OR = [...(whereClause.OR || []), ...nameOrConditions];
      delete whereClause.name;
    }

    if (colorOrConditions.length > 0) {
      whereClause.OR = [...(whereClause.OR || []), ...colorOrConditions];
      delete whereClause.color;
    }

    if (statusOrConditions.length > 0) {
      whereClause.OR = [...(whereClause.OR || []), ...statusOrConditions];
      delete whereClause.isActive;
    }

    if (isActiveOrConditions.length > 0) {
      whereClause.OR = [...(whereClause.OR || []), ...isActiveOrConditions];
      delete whereClause.isActive;
    }

    const findManyOptions = {
      where: whereClause,
      orderBy: { createdAt: "desc" as const },
      ...(pageSize && { skip, take: pageSize }),
    };

    const [rawData, totalLength, activeCount, inactiveCount] =
      await Promise.all([
        this.prisma.category.findMany(findManyOptions),
        this.prisma.category.count({
          where: whereClause,
        }),
        this.prisma.category.count({
          where: {
            ...whereClause,
            isActive: true,
          },
        }),
        this.prisma.category.count({
          where: {
            ...whereClause,
            isActive: false,
          },
        }),
      ]);

    return {
      data: rawData,
      totalLength,
      activeCount,
      inactiveCount,
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
