import { Injectable } from "@nestjs/common";
import type { CreateInvestmentDto } from "../dtos/create-investment.dto";
import { FilterInvestmentDto } from "../dtos/filter-investment.dto";
import type { UpdateInvestmentDto } from "../dtos/update-investment.dto";
import { InvestmentRepository } from "../investment.repository";

@Injectable()
export class InvestmentService {
  constructor(private readonly repo: InvestmentRepository) {}

  findAll(filter: FilterInvestmentDto) {
    return this.repo.findAll(filter);
  }

  async create(data: CreateInvestmentDto, userId: string) {
    const category = await this.repo.findOrCreateCategory(
      data.category,
      "INVESTMENT"
    );

    return this.repo.create({
      ...data,
      user: { connect: { id: userId } },
      category: { connect: { id: category.id } },
    });
  }

  async update(id: string, data: UpdateInvestmentDto) {
    const { categoryId, ...updateData } = data;

    return this.repo.update(id, {
      ...updateData,
      ...(categoryId && { category: { connect: { id: categoryId } } }),
    });
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
