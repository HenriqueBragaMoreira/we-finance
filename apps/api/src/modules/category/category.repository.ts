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

    let nameCondition: Prisma.StringFilter<"Category"> | undefined;
    if (filters.name) {
      const names = filters.name.split(",").map((name) => name.trim());
      if (names.length === 1) {
        nameCondition = { contains: names[0], mode: "insensitive" as const };
      } else {
        nameCondition = undefined;
      }
    }

    let typeCondition:
      | "INCOME"
      | "EXPENSE"
      | "INVESTMENT"
      | { in: ("INCOME" | "EXPENSE" | "INVESTMENT")[] }
      | undefined;
    if (filters.type) {
      const types = filters.type.split(",").map((type) => type.trim());
      if (types.length === 1) {
        typeCondition = types[0] as "INCOME" | "EXPENSE" | "INVESTMENT";
      } else {
        typeCondition = {
          in: types as ("INCOME" | "EXPENSE" | "INVESTMENT")[],
        };
      }
    }

    let statusCondition: boolean | undefined;
    let statusORCondition: Prisma.CategoryWhereInput[] | undefined;
    if (filters.status) {
      const statuses = filters.status.split(",").map((status) => status.trim());
      if (statuses.length === 1) {
        statusCondition = statuses[0] === "true";
      } else {
        statusORCondition = statuses.map((status) => ({
          isActive: status === "true",
        }));
        statusCondition = undefined;
      }
    }

    let colorCondition: Prisma.StringFilter<"Category"> | undefined;
    if (filters.color) {
      const colors = filters.color.split(",").map((color) => color.trim());
      if (colors.length === 1) {
        colorCondition = { contains: colors[0], mode: "insensitive" as const };
      } else {
        colorCondition = undefined;
      }
    }

    // Processar filtros de data
    let createdAtCondition: Prisma.DateTimeFilter<"Category"> | undefined;
    if (filters.createdAt) {
      // Verificar se é um timestamp em milissegundos ou uma data ISO
      const dateValue = Number.isNaN(Number(filters.createdAt))
        ? filters.createdAt
        : new Date(Number(filters.createdAt)).toISOString();

      // Garantir que estamos filtrando apenas pelo dia específico
      const startOfDay = new Date(dateValue);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(dateValue);
      endOfDay.setUTCHours(23, 59, 59, 999);

      createdAtCondition = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    let updatedAtCondition: Prisma.DateTimeFilter<"Category"> | undefined;
    if (filters.updatedAt) {
      // Verificar se é um timestamp em milissegundos ou uma data ISO
      const dateValue = Number.isNaN(Number(filters.updatedAt))
        ? filters.updatedAt
        : new Date(Number(filters.updatedAt)).toISOString();

      // Garantir que estamos filtrando apenas pelo dia específico
      const startOfDay = new Date(dateValue);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(dateValue);
      endOfDay.setUTCHours(23, 59, 59, 999);

      updatedAtCondition = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const whereClause: Prisma.CategoryWhereInput = {
      name: nameCondition,
      type: typeCondition,
      isActive: statusCondition,
      color: colorCondition,
      createdAt: createdAtCondition,
      updatedAt: updatedAtCondition,
    };

    if (filters.name) {
      const names = filters.name.split(",").map((name) => name.trim());
      if (names.length > 1) {
        whereClause.OR = [
          ...(whereClause.OR || []),
          ...names.map((name) => ({
            name: { contains: name, mode: "insensitive" as const },
          })),
        ];
        delete whereClause.name;
      }
    }

    if (filters.color) {
      const colors = filters.color.split(",").map((color) => color.trim());
      if (colors.length > 1) {
        whereClause.OR = [
          ...(whereClause.OR || []),
          ...colors.map((color) => ({
            color: { contains: color, mode: "insensitive" as const },
          })),
        ];
        delete whereClause.color;
      }
    }

    if (statusORCondition) {
      whereClause.OR = [...(whereClause.OR || []), ...statusORCondition];
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
