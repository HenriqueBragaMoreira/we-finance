import { ConflictException, Injectable } from "@nestjs/common";
import { CategoryRepository } from "../category.repository";
import type { CreateCategoryDto } from "../dtos/create-category.dto";
import { FilterCategoryDto } from "../dtos/filter-category.dto";
import type { UpdateCategoryDto } from "../dtos/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(private readonly repo: CategoryRepository) {}

  findAll(filter: FilterCategoryDto) {
    return this.repo.findAll(filter);
  }

  async create(data: CreateCategoryDto) {
    const existingCategory = await this.repo.findByNameAndType(
      data.name,
      data.type
    );

    if (existingCategory) {
      throw new ConflictException(
        `Category with name "${data.name}" and type "${data.type}" already exists`
      );
    }

    return this.repo.create(data);
  }

  update(id: string, data: UpdateCategoryDto) {
    return this.repo.update(id, data);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
